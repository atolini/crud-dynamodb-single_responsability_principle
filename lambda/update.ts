import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import logEventContext from "./_shared/logEventContext";
import extractId from "./_shared/extractId";
import logInfo from "./_shared/logInfo";
import extractBody from "./_shared/extractBody";
import validateItem from "./_shared/validateItem";
import {
  UpdateItemInput,
  Key,
  UpdateItemOutput,
} from "aws-sdk/clients/dynamodb";
import logError from "./_shared/logError";
import handleError from "./_shared/handleError";
import createResponse from "./_shared/createResponse";
import logResponse from "./_shared/logResponse";
import parseBody from "./_shared/parseBody";
import createSchema from "./_shared/createSchema";
import { SchemaType } from "./_type";
import baseSchema from "./schema";
import { z } from "zod";

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;
const schema = createSchema(SchemaType.UPDATE, baseSchema) as z.ZodObject<any>;

/**
 * Função principal do Lambda que manipula eventos da API Gateway, valida dados e atualiza um item no DynamoDB.
 *
 * @param {APIGatewayProxyEvent} event - O evento da API Gateway contendo os dados da solicitação.
 * @param {Context} context - O contexto da execução do Lambda, que fornece informações sobre a invocação.
 * @returns {Promise<object>} - A resposta criada após o processamento do evento.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logEventContext(event, context);

  try {
    const id = extractId(event);
    logInfo("ID extracted successfully", id);

    const body: string = extractBody(event);
    logInfo("Body extracted", body, "handler");

    const item: object = parseBody(body);
    logInfo("Parsed item", item, "handler");

    const result: object = validateItem(schema, item);
    logInfo("Validated item", result, "handler");

    const params = buildParameters(result, id);
    logInfo("DynamoDB update parameters", params);

    const dbResult = await updateItem(params);
    console.log("Item updated successfully", dbResult);

    const response = createResponse(200, {
      item: dbResult.Attributes,
    });

    logResponse(response, "handler");

    return response;
  } catch (error: unknown) {
    logError(error, "handler");
    const response = handleError(error, createResponse);
    logResponse(response, "handler");
    return response;
  }
};

/**
 * Atualiza um item no DynamoDB com base nos parâmetros fornecidos.
 *
 * @param {UpdateItemInput} params - Parâmetros para a atualização do item no DynamoDB.
 * @returns {Promise<UpdateItemOutput>} - Resultado da operação de atualização no DynamoDB.
 */
const updateItem = async (
  params: UpdateItemInput,
): Promise<UpdateItemOutput> => {
  return await client.update(params).promise();
};

/**
 * Constrói os parâmetros para atualizar um item no DynamoDB com base no item e ID fornecidos.
 *
 * @param {object} item - O item a ser atualizado no DynamoDB.
 * @param {string} id - O ID do item a ser atualizado.
 * @returns {UpdateItemInput} - Parâmetros para a atualização do item no DynamoDB.
 */
const buildParameters = (item: object, id: string): UpdateItemInput => {
  const updateExpressions = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(item)) {
    const attributeKey = `#${key}`;
    const attributeValue = `:${key}`;
    updateExpressions.push(`${attributeKey} = ${attributeValue}`);
    expressionAttributeNames[attributeKey] = key;
    expressionAttributeValues[attributeValue] = value;
  }

  const updateExpression = `SET ${updateExpressions.join(", ")}`;
  logInfo("Update Expression:", updateExpression, "buildParameters");
  logInfo(
    "Expression Attribute Names:",
    expressionAttributeNames,
    "buildParameters",
  );
  logInfo(
    "Expression Attribute Values:",
    expressionAttributeValues,
    "buildParameters",
  );

  return {
    TableName: tableName,
    Key: { id } as Key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };
};
