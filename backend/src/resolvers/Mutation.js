const Mutations = {
    async createItem(parents, args, ctx, info) {
        // TODO Check if they are logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info)

        return item;
    }
    // createDog(parents, args, ctx, info) {
    //     console.log(args)
    // }
};

module.exports = Mutations;
