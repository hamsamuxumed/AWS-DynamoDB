const AWS = require('aws-sdk');
// AWS.config.update({region:'us-east-1'});
require('dotenv').config();

// const AWS_ACCESS_KEY_ID=process.env.AWS_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY=process.env.AWS_SECRET_ACCESS_KEY
// const AWS_DEFAULT_REGION=process.env.AWS_DEFAULT_REGION
// AWS.config.update({
//     region: AWS_DEFAULT_REGION,
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
// });

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'BookList';
const getBooks = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const books = await dynamoClient.scan(params).promise();
    return books;
};

const getBookByTitle = async (name) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(title, :title)',
        ExpressionAttributeValues: {
            ':title': `${name}`
        },
    };
    return await dynamoClient.scan(params).promise();
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
    getBookByTitle,
    addOrUpdateBook,
    deleteBook,
};
