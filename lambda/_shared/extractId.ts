import { APIGatewayProxyEvent } from "aws-lambda";
import MissingIdError from "../_error/MissingIdError";

/**
 * Extrai o ID dos parâmetros de caminho do evento do API Gateway.
 *
 * @param {APIGatewayProxyEvent} event - O objeto do evento do API Gateway, contendo detalhes sobre a requisição.
 * @returns {string} O ID extraído dos parâmetros de caminho.
 * @throws {MissingIdError} Se o ID não estiver presente nos parâmetros de caminho.
 */
const extractId = (event: APIGatewayProxyEvent): string => {
  const id = event.pathParameters?.id;

  if (!id) {
    throw new MissingIdError();
  }

  return id;
};

export default extractId;
