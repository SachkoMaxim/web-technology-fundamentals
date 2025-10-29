const express = require('express');
const dotenv = require('dotenv');
const { createHandler } = require('graphql-http/lib/use/express');
const connectDB = require('./db');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

dotenv.config();
const app = express();

connectDB();

app.use(
    "/graphql",
    createHandler({
        schema: graphqlSchema,
        rootValue: graphqlResolver
    })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
