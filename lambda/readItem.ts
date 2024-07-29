import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import logEventContext from "./_shared/logEventContext";
import extractId from "./_shared/extractId";
import logInfo from "./_shared/logInfo";
import createResponse from "./_shared/createResponse";
import logResponse from "./_shared/logResponse";
import logError from "./_shared/logError";
import handleError from "./_shared/handleError";

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

/**
 * Manipulador para o evento do API Gateway. Processa a solicitação, consulta um item no DynamoDB e retorna uma resposta HTTP.
 *
 * @param {APIGatewayProxyEvent} event - O evento do API Gateway contendo os parâmetros de consulta e outras informações.
 * @param {Context} context - O contexto de execução do AWS Lambda.
 * @returns {Promise<APIGatewayProxyResult>} - Uma promessa que resolve com a resposta HTTP.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logEventContext(event, context);

  try {
    const id = extractId(event);
    logInfo("ID extracted successfully", id);

    const result = await getItem(id);
    logInfo("DynamoDB response", result);

    if (!result.Item) {
      return itemNotFound();
    }

    return itemFound(result);
  } catch (error) {
    logError(error, "handler");
    const response = handleError(error, createResponse);
    logResponse(response, "handler");
    return response;
  }
};

/**
 * Cria uma resposta HTTP com o item encontrado no DynamoDB.
 *
 * @param {any} item - O item encontrado no DynamoDB.
 * @returns {APIGatewayProxyResult} - A resposta HTTP com o item encontrado.
 */
const itemFound = (item: any): APIGatewayProxyResult => {
  const response = createResponse(200, {
    body: item.Item,
  });

  logInfo("Response", response);

  return response;
};

/**
 * Cria uma resposta HTTP indicando que o item não foi encontrado.
 *
 * @returns {APIGatewayProxyResult} - A resposta HTTP indicando que o item não foi encontrado.
 */
const itemNotFound = (): APIGatewayProxyResult => {
  const response = createResponse(404, {
    message: "Item not found",
  });

  logResponse(response, "handler");
  return response;
};

/**
 * Consulta um item no DynamoDB com base no ID fornecido.
 *
 * @param {string} id - O ID do item a ser consultado.
 * @returns {Promise<DynamoDB.DocumentClient.GetItemOutput>} - Uma promessa que resolve com o resultado da consulta do DynamoDB.
 */
const getItem = async (
  id: string,
): Promise<DynamoDB.DocumentClient.GetItemOutput> => {
  const params = {
    TableName: tableName,
    Key: { id },
  };

  return await client.get(params).promise();
};
