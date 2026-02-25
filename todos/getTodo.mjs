import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import
// import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
const config = {}; // type is DynamoDBClientConfig
const client = new DynamoDBClient(config);

export const handler = async (event) => {
  const id = event.pathParameters.id

  const input = {
    Key: {
      id: {
        S: id
      }
    },
    TableName: process.env.TODO_TABLE
  };

  const command = new GetItemCommand(input);
  const results = await client.send(command);
  const headers = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  }
  
  const response = {
    statusCode: 200,
    body: JSON.stringify(results.Item),
    headers
  };
  return response;
};
