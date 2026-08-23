import { z } from "zod";

export const BORK_MAX_LENGTH = 280;

export const borkContentSchema = z
  .string()
  .trim()
  .min(1)
  .max(BORK_MAX_LENGTH);
