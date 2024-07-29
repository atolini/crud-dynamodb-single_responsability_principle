import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import extractId from "./_shared/extractId";
import createResponse from "./_shared/createResponse";
import { DynamoDB } from "aws-sdk";
import handleError from "./_shared/handleError";
import logEventContext from "./_shared/logEventContext";
import logError from "./_shared/logError";
import logResponse from "./_shared/logResponse";
import logInfo from "./_shared/logInfo";

const client = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

/**
 * Manipulador principal para a requisição do API Gateway.
 *
 * Extrai o ID do evento, exclui o item correspondente e retorna uma resposta adequada.
 * Em caso de erro, lida com o erro e retorna uma resposta de erro apropriada.
 *
 * @param {APIGatewayProxyEvent} event - O objeto do evento do API Gateway, contendo detalhes sobre a requisição.
 * @param {Context} context - O objeto de contexto do Lambda, contendo detalhes sobre o ambiente de execução.
 *
 * @returns {Promise<APIGatewayProxyResult>} A resposta do API Gateway com base na operação realizada.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  logEventContext(event, context);

  try {
    const id = extractId(event);
    logInfo("ID extracted successfully", id, "handler");

    await deleteItem(id);
    logInfo("Item deleted successfully", id, "handler");

    const response = createResponse(200, {
      message: "Item deleted successfully",
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
 * Exclui um item da tabela do DynamoDB com base no ID fornecido.
 *
 * @param {string} id - O ID do item a ser excluído.
 *
 * @returns {Promise<void>} Uma promessa que resolve quando o item for excluído com sucesso.
 */
const deleteItem = async (id: string): Promise<void> => {
  const params = {
    TableName: tableName,
    Key: { id },
  };

  await client.delete(params).promise();
};
