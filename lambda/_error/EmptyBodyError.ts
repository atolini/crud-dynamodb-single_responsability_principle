/**
 * Classe para representar um erro de corpo ausente em uma requisição.
 *
 * @class EmptyBodyError
 * @extends {Error}
 */
export class EmptyBodyError extends Error {
  /**
   * Cria uma instância de EmptyBodyError.
   *
   * @param {string} [message="Body is missing."] - A mensagem de erro. Opcional, com valor padrão "Body is missing.".
   */
  constructor(message: string = "Body is missing.") {
    super(message);
    this.name = "MissingBodyError";
  }
}

export default EmptyBodyError;
