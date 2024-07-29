import {
  objectOutputType,
  z,
  ZodObject,
  ZodType,
  ZodTypeAny,
  ZodTypeDef,
} from "zod";

/**
 * Valida um objeto contra um esquema Zod e opcionalmente inclui um ID no objeto de entrada.
 *
 * @param {ZodObject<any>} schema - O esquema Zod usado para validação. Deve ser um objeto Zod que define a estrutura esperada dos dados.
 * @param {Record<string, any>} value - O objeto que será validado. Deve corresponder à estrutura definida no esquema Zod, exceto pelo ID opcional.
 * @param {string} [id] - Um ID opcional a ser incluído no objeto antes da validação. Se fornecido, será adicionado ao objeto de entrada.
 * @returns {objectOutputType<any, ZodTypeAny>} - O objeto validado conforme o esquema Zod. Retorna o objeto validado se a validação for bem-sucedida.
 */
const validateItem = <T>(
  schema: z.ZodObject<any>,
  value: Record<string, any>,
  id?: string,
): objectOutputType<any, ZodTypeAny> => {
  const dataToValidate = id ? { id, ...value } : { ...value };
  return schema.parse(dataToValidate);
};

export default validateItem;
