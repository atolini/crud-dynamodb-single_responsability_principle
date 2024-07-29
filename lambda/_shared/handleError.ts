import { APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import EmptyBodyError from "../_error/EmptyBodyError";

/**
 * Lida com erros e cria uma resposta apropriada com base no tipo de erro.
 *
 * @param {unknown} error - O erro que ocorreu.
 * @param {(x: number, y: any) => APIGatewayProxyResult} createResponse - Função para criar uma resposta do API Gateway.
 * @returns {APIGatewayProxyResult} A resposta apropriada com base no tipo de erro.
 */
const handleError = (
  error: unknown,
  createResponse: (x: number, y: any) => APIGatewayProxyResult,
): APIGatewayProxyResult => {
  if (error instanceof z.ZodError) {
    return createResponse(400, {
      message: "Validation error",
      errors: error.errors,
    });
  }

  if (error instanceof EmptyBodyError) {
    return createResponse(400, {
      message: error.message,
    });
  }

  return createResponse(500, {
    message: "Internal Server Error",
    error: (error as Error).message,
  });
};

export default handleError;
