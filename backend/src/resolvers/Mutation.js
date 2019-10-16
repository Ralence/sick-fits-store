const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO Check if they are logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info)

        return item;
    },

    updateItem(parent, args, ctx, info) {
        // First take a copy of updates
        const updates = { ...args };
        // Remove the id from the updates
        delete updates.id;
        // Run the update method
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        },
            info
        )
    },

    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        // 1 Find the item
        const item = await ctx.db.query.item({ where }, `{ id title }`);
        // 2 Check if the user owns the item or has a permission
        // TODO
        // 3 Delete the item
        return ctx.db.mutation.deleteItem({ where }, info);
    },

    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        // hast the user password
        const password = await bcrypt.hash(args.password, 10);
        // create the user in the database
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: { set: ['USER'] }
                }
            },
            info);
        // create JWT for the user
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // we set JWT as a cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        // finally return the user to the browser
        return user;
    }
};

module.exports = Mutations;
