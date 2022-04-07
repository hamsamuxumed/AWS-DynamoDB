const AWS = require('aws-sdk');
require('dotenv').config();

const AWS_ACCESS_KEY_ID="AKIAWMZ6RNT4BXVP7W7C"
const AWS_SECRET_ACCESS_KEY="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"
const AWS_DEFAULT_REGION="us-east-1"
AWS.config.update({
    region: AWS_DEFAULT_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'hpCharacters';
const getCharacters = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const characters = await dynamoClient.scan(params).promise();
    return characters;
};

const getCharacterById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.get(params).promise();
};

const addOrUpdateCharacter = async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character,
    };
    return await dynamoClient.put(params).promise();
};

const deleteCharacter = async (id) => {
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
    getCharacters,
    getCharacterById,
    addOrUpdateCharacter,
    deleteCharacter,
};