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
    }
};

module.exports = Mutations;
