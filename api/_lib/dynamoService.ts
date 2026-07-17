import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "./dynamodb";

export async function saveAnalysis(
  input: string,
  analysis: any,
  userId?: string,
  email?: string
) {
  await docClient.send(
    new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: crypto.randomUUID(),
        userId,
        email,
        prompt: input,
        analysis,
        createdAt: new Date().toISOString(),
      },
    })
  );
}