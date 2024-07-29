import { APIGatewayProxyResult } from "aws-lambda";

/**
 * Registra a resposta do API Gateway no console com informações detalhadas.
 *
 * @param {APIGatewayProxyResult} response - O objeto de resposta do API Gateway.
 * @param {string} funcName - O nome da função que gerou a resposta.
 *
 * @returns {void}
 */
const logResponse = (
  response: APIGatewayProxyResult,
  funcName: string,
): void => {
  console.log(
    `[${funcName}][END] Response:`,
    JSON.stringify(response, null, 2),
  );
};

export default logResponse;
