const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Books';
const getBooks = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const books = await dynamoClient.scan(params).promise();
    return books;
};

const getBookById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.get(params).promise();
};

const addOrUpdateBook = async (book) => {
    const params = {
        TableName: TABLE_NAME,
        Item: book,
    };
    return await dynamoClient.put(params).promise();
};

const deleteBook = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.delete(params).promise();
};

module.exports = {
    dynamoClient,
    getBooks,
    getBookById,
    addOrUpdateBook,
    deleteBook,
};