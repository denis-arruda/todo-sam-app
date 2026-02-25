import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, DeleteItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import

const config = {};
const client = new DynamoDBClient(config);

export const handler = async (event) => {
  const id = event.pathParameters.id

  const input = {
    Key: {
      id: {
        S: id
      }
    },
    TableName: process.env.TODO_TABLE   ,
    ReturnValues: "ALL_OLD"
  };

  const command = new DeleteItemCommand(input);
  const results = await client.send(command);
  const headers = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  }
  
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Todo deleted successfully",
      deletedItem: results.Attributes
    }),
    headers
  };
  return response;
};