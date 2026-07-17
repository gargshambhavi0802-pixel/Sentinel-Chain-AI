import {
  LambdaClient,
  InvokeCommand,
} from "@aws-sdk/client-lambda";

const lambda = new LambdaClient({
  region: process.env.AWS_REGION,
});

export async function invokeAnalysisLambda(payload: any) {
  const command = new InvokeCommand({
    FunctionName: process.env.LAMBDA_FUNCTION_NAME,
    Payload: Buffer.from(JSON.stringify(payload)),
  });

  const response = await lambda.send(command);

  if (!response.Payload) {
    throw new Error("Lambda returned no response");
  }

  return JSON.parse(
    Buffer.from(response.Payload).toString()
  );
}