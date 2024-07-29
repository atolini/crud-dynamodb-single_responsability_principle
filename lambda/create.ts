import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import logEventContext from "./_shared/logEventContext";
import extractBody from "./_shared/extractBody";
import logInfo from "./_shared/logInfo";
import generateId from "./_shared/generateId";
import createResponse from "./_shared/createResponse";
import logResponse from "./_shared/logResponse";
import logError from "./_shared/logError";
import handleError from "./_shared/handleError";
import parseBody from "./_shared/parseBody";
import validateItem from "./_shared/validateItem";
import createSchema from "./_shared/createSchema";
import { SchemaType } from "./_type";
import baseSchema from "./schema";
import { z } from "zod";

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;
const schema = createSchema(SchemaType.CREATE, baseSchema) as z.ZodObject<any>;

/**
 * Função principal do Lambda que manipula um evento da API Gateway, processa e valida o corpo da solicitação,
 * gera um ID, insere um item no DynamoDB e retorna uma resposta apropriada.
 *
 * @param {APIGatewayProxyEvent} event - O evento da API Gateway contendo os dados da solicitação.
 * @param {Context} context - O contexto da execução do Lambda, que fornece informações sobre a invocação.
 * @returns {Promise<APIGatewayProxyResult>} - A resposta HTTP da API Gateway, representando o resultado do processamento.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logEventContext(event, context);

  try {
    const body: string = extractBody(event);
    logInfo("Body extracted", body, "handler");

    const item: object = parseBody(body);
    logInfo("Parsed item", item, "handler");

    const id: string = generateId("ACT");
    logInfo("Generated id", id, "handler");

    const result: object = validateItem(schema, item, id);
    logInfo("Validated item", result, "handler");

    await insertIntoDynamoDB(result);
    logInfo("Item inserted into DynamoDB", result, "handler");

    const response = createResponse(201, {
      item: result,
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
 * Insere os dados no DynamoDB.
 * @param {any} item - Dados a serem inseridos no DynamoDB.
 * @returns {Promise<void>} - Promise resolvida quando a inserção for concluída.
 */
const insertIntoDynamoDB = async (item: any): Promise<void> => {
  const params = {
    TableName: tableName,
    Item: item,
  };
  await client.put(params).promise();
};
