/**
 * Converte uma string JSON em um objeto JavaScript.
 *
 * Esta função analisa a string JSON fornecida e retorna o objeto JavaScript correspondente.
 *
 * @param {string} body - A string JSON que deve ser analisada.
 * @returns {object} O objeto JavaScript resultante da análise da string JSON.
 * @throws {SyntaxError} Se a string JSON fornecida for inválida ou não puder ser analisada.
 *
 */
const parseBody = (body: string): object => {
  return JSON.parse(body);
};

export default parseBody;
