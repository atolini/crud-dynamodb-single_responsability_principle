import { z, ZodSchema, ZodTypeAny } from "zod";
import { SchemaType } from "../_type";

/**
 * Retorna um schema de validação (zod) baseado no tipo de schema especificado.
 *
 * @param {SchemaType} schemaType - O tipo de schema a ser gerado.
 * @param {Record<string, ZodTypeAny>} baseSchema - O schema base a ser ajustado.
 * @returns {ZodSchema} O schema de validação gerado.
 */
const createSchema = (
  schemaType: SchemaType,
  baseSchema: Record<string, ZodTypeAny>,
): ZodSchema => {
  const schemaFields = { ...baseSchema };

  if (schemaType === SchemaType.UPDATE) {
    for (const key in schemaFields) {
      schemaFields[key] = schemaFields[key].optional();
    }
  }

  return z.object(schemaFields);
};

export default createSchema;
