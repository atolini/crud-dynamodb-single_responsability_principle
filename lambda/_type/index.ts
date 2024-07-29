/**
 * Enumeração para definir o tipo de schema de validação.
 *
 * @enum {string}
 * @readonly
 */
export enum SchemaType {
  /**
   * Utilizado para criar um schema de validação (zod) que contém todos os campos obrigatórios,
   * garantindo a consistência dos dados na inserção no banco.
   */
  CREATE = "CREATE",
  /**
   * Utilizado para criar um schema de validação (zod) com todos os campos opcionais,
   * permitindo a atualização de apenas os campos desejados no objeto.
   */
  UPDATE = "UPDATE",
}
