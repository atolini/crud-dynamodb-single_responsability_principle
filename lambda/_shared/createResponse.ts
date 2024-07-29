import { APIGatewayProxyResult } from "aws-lambda";

/**
 * Cria a resposta HTTP.
 * @param {number} statusCode - Código de status HTTP.
 * @param {any} body - Corpo da resposta.
 * @returns {any} - Objeto de resposta HTTP.
 */
const createResponse = (
  statusCode: number,
  body: any,
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

export default createResponse;
