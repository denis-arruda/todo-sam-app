import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import

const config = {};
const client = new DynamoDBClient(config);

export const handler = async (event) => {
  const body = JSON.parse(event.body);

  // Generate a unique ID if not provided
  const id = Date.now().toString();

  const input = {
    TableName: process.env.TODO_TABLE,
    Item: {
      id: {
        S: id
      },
      username: body.username,
      description: body.description,
      targetDate: body.targetDate,
      done: body.done
    }
  };

  const command = new PutItemCommand(input);
  const results = await client.send(command);
  const headers = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  }
  
  const response = {
    statusCode: 201,
    body: JSON.stringify({
      id: id,
      message: "Todo created successfully"
    }),
    headers
  };
  return response;
};