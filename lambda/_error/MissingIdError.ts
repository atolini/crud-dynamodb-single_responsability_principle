/**
 * Classe para representar um erro de ID ausente em uma requisição.
 *
 * @class MissingIdError
 * @extends {Error}
 */
class MissingIdError extends Error {
  /**
   * Cria uma instância de MissingIdError.
   *
   * @param {string} [message="ID is missing."] - A mensagem de erro. Opcional, com valor padrão "ID is missing.".
   */
  constructor(message: string = "ID is missing.") {
    super(message);
    this.name = "MissingIdError";
  }
}

export default MissingIdError;
