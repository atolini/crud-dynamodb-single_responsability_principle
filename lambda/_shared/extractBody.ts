import { APIGatewayProxyEvent } from "aws-lambda";
import EmptyBodyError from "../_error/EmptyBodyError";

/**
 * Extrai o corpo da requisição a partir do evento do API Gateway.
 *
 * @param {APIGatewayProxyEvent} event - O evento recebido pelo API Gateway que contém a requisição.
 *
 * @returns {string} - O corpo da requisição.
 *
 * @throws {EmptyBodyError} - Lança um erro se o corpo da requisição estiver vazio ou não definido.
 */
const extractBody = (event: APIGatewayProxyEvent): string => {
  if (!event.body) {
    throw new EmptyBodyError();
  }

  return event.body;
};

export default extractBody;
