const { DateTimeResolver } = require("graphql-scalars")
const Contract = require('../models/Contract');

const resolvers = {
    DateTime: DateTimeResolver,
    getContracts: () => {
        try {
            return Contract.find();
        } catch (error) {
            throw new Error('Failed to get contracts');
        }
    },
    getContractById: ({ id }) => {
        try {
            return Contract.findById(id);
        } catch (error) {
            throw new Error(`Failed to get contract with id ${id}`);
        }
    },
    addContract: async ({ input }) => {
        try {
            const newContract = new Contract(input);
            await newContract.save();
            return newContract;
        } catch (error) {
            throw new Error('Failed to add new contract');
        }
    },
    updateContract: async ({ id, input }) => {
        try {
            const updatedContract = await Contract.findByIdAndUpdate(id, input, {
                new: true
            });
            return updatedContract;
        } catch (error) {
            throw new Error(`Failed to update contract with id ${id}`);
        }
    },
    deleteContract: async ({ id }) => {
        try {
            const deletedContract = await Contract.findByIdAndDelete(id);
            return deletedContract;
        } catch (error) {
            throw new Error(`Failed to delete contract with id ${id}`);
        }
    }
};

module.exports = resolvers;
