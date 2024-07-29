import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import logError from "./_shared/logError";
import handleError from "./_shared/handleError";
import createResponse from "./_shared/createResponse";
import logResponse from "./_shared/logResponse";
import logEventContext from "./_shared/logEventContext";
import logInfo from "./_shared/logInfo";

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

/**
 * Manipulador para o evento do API Gateway. Processa a solicitação, consulta itens no DynamoDB e retorna uma resposta HTTP.
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
    const limit: number = extractLimit(event);
    logInfo("Limit parameter", limit);

    const lastEvaluatedKey: DynamoDB.DocumentClient.Key | undefined =
      extractLastEvaluatedKey(event);
    logInfo("LastEvaluatedKey parameter", lastEvaluatedKey);

    const dbResponse: DynamoDB.DocumentClient.ScanOutput = await listItems(
      limit,
      lastEvaluatedKey,
    );
    logInfo("Response", dbResponse);

    const response = createResponse(200, {
      items: dbResponse.Items,
      lastEvaluatedKey: dbResponse.LastEvaluatedKey
        ? JSON.stringify(dbResponse.LastEvaluatedKey)
        : null,
    });

    logResponse(response, "handler");
    return response;
  } catch (error) {
    logError(error, "handler");
    const response = handleError(error, createResponse);
    logResponse(response, "handler");
    return response;
  }
};

/**
 * Extrai o parâmetro de limite dos parâmetros de consulta de um evento do API Gateway.
 *
 * @param {APIGatewayProxyEvent} event - O evento do API Gateway contendo os parâmetros de consulta.
 * @returns {number} - O valor do limite como um número. Retorna 10 se o parâmetro de limite não estiver presente ou não for válido.
 */
const extractLimit = (event: APIGatewayProxyEvent): number => {
  return event.queryStringParameters?.limit
    ? parseInt(event.queryStringParameters.limit)
    : 10;
};

/**
 * Extrai a chave de início exclusiva do evento API Gateway.
 *
 * @param {APIGatewayProxyEvent} event - O evento do API Gateway que contém os parâmetros de consulta.
 * @returns {DynamoDB.DocumentClient.Key | null} - A chave de início exclusiva como um objeto, ou null se não estiver presente.
 */
const extractLastEvaluatedKey = (
  event: APIGatewayProxyEvent,
): DynamoDB.DocumentClient.Key | undefined => {
  const lastEvaluatedKeyString = event.queryStringParameters?.lastEvaluatedKey;

  // TO-DO: Sempre que for realizar uma paginação o lastEvaluatedKey deve ser enviado obrigatoriamente
  // no seguinte formato {"id": "PROTOCOL"}, caso ao contrario irá ocorrer o erro JSON syntax
  // Criar uma rotina para validar o ID e retornar mensagem de erro apropriada

  if (lastEvaluatedKeyString) {
    return JSON.parse(
      lastEvaluatedKeyString,
    ) as unknown as DynamoDB.DocumentClient.Key;
  }

  return undefined;
};

/**
 * Lista itens de uma tabela do DynamoDB com base no limite e na chave avaliada por último.
 *
 * @param {number} limit - O número máximo de itens a serem retornados na operação de varredura.
 * @param {DynamoDB.DocumentClient.Key | undefined} lastEvaluatedKey - A chave avaliada por último para continuar a varredura de onde parou.
 * @returns {Promise<DynamoDB.DocumentClient.ScanOutput>} - Uma promessa que resolve com o resultado da varredura do DynamoDB.
 */
const listItems = async (
  limit: number,
  lastEvaluatedKey: DynamoDB.DocumentClient.Key | undefined,
): Promise<DynamoDB.DocumentClient.ScanOutput> => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: tableName,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  logInfo("DynamoDB Scan params", params, "listItem");

  return await client.scan(params).promise();
};
