import { APIGatewayProxyEvent, Context } from "aws-lambda";

/**
 * Registra no console o evento do API Gateway e o contexto do Lambda.
 *
 * @param {APIGatewayProxyEvent} event - O objeto do evento do API Gateway, contendo detalhes sobre a requisição.
 * @param {Context} context - O objeto de contexto do Lambda, contendo detalhes sobre o ambiente de execução.
 *
 * @returns {void}
 */
const logEventContext = (
  event: APIGatewayProxyEvent,
  context: Context,
): void => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  console.log("Received context:", JSON.stringify(context, null, 2));
};

export default logEventContext;
