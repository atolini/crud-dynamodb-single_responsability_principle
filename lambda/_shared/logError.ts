import { z } from "zod";

/**
 * Registra erros no console com informações detalhadas.
 *
 * @param {unknown} error - O erro que ocorreu.
 * @param {string} funcName - O nome da função onde o erro ocorreu.
 */
const logError = (error: unknown, funcName: string): void => {
  const formatErrorDetails = (e: Error): string =>
    JSON.stringify(
      {
        name: e.name,
        message: e.message,
      },
      null,
      2,
    );

  if (error instanceof z.ZodError) {
    console.error(
      `[${funcName}] Validation error: ${JSON.stringify(error.errors, null, 2)}`,
    );
  } else if (error instanceof Error) {
    console.error(`[${funcName}] Error: ${formatErrorDetails(error)}`);
  } else {
    console.error(
      `[${funcName}] Unexpected error: ${JSON.stringify(error, null, 2)}`,
    );
  }
};

export default logError;
