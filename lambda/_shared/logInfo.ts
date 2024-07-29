/**
 * Registra uma mensagem no log com um valor adicional. Se o valor for um objeto,
 * ele será convertido para uma string JSON para melhor visualização.
 *
 * @param {string} message - A mensagem a ser registrada no log.
 * @param {any} value - O valor a ser registrado. Se for um objeto, será convertido para JSON.
 * @param {string} [funcName="handler"] - O nome da função que gerou o log. Default é "handler".
 *
 * @returns {void}
 */
const logInfo = (
  message: string,
  value: any,
  funcName: string = "handler",
): void => {
  const prefix = `[${funcName}][INFO]`;

  if (typeof value === "object" && value !== null) {
    console.log(`${prefix} - ${message}: ${JSON.stringify(value, null, 2)}`);
  } else {
    console.log(`${prefix} - ${message}: ${value}`);
  }
};

export default logInfo;
