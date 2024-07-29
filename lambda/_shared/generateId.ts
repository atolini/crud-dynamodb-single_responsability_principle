/**
 * Gera um identificador único baseado em um prefixo, timestamp e uma parte aleatória.
 *
 * @param {string} prefix - O prefixo que será adicionado ao início do identificador gerado.
 * @returns {string} - O identificador único gerado, no formato `prefixo-timestamp-parteAleatória`.
 */
const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${randomPart}`;
};

export default generateId;
