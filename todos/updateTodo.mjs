import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"; // ES Modules import
// const { DynamoDBClient, UpdateItemCommand } = require("@aws-sdk/client-dynamodb"); // CommonJS import

const config = {};
const client = new DynamoDBClient(config);

export const handler = async (event) => {
  const id = event.pathParameters.id
  const body = JSON.parse(event.body);

  // Build UpdateExpression and ExpressionAttributeValues dynamically
  const updateExpressionParts = [];
  const expressionAttributeValues = {};

  Object.keys(body).forEach((key, index) => {
    if (key !== "id") { // Don't update the key
      const placeholder = `:val${index}`;
      updateExpressionParts.push(`${key} = ${placeholder}`);
      expressionAttributeValues[placeholder] = body[key];
    }
  });

  const input = {
    Key: {
      id: {
        S: id
      }
    },
    TableName: process.env.TODO_TABLE,
    UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  const command = new UpdateItemCommand(input);
  const results = await client.send(command);
  const headers = {
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  }
  
  const response = {
    statusCode: 200,
    body: JSON.stringify(results.Attributes),
    headers
  };
  return response;
};