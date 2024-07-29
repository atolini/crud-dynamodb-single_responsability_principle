import { z } from "zod";

const baseSchema = {
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
};

export default baseSchema;
