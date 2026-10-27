import { z } from "zod";

// What each field accepts while typing; a keystroke that fails is dropped.
export const tipFormSchema = z.object({
  bill: z
    .string()
    .regex(/^\d*\.?\d{0,2}$/)
    .refine((v) => (parseFloat(v) || 0) <= 100000),
  tip: z
    .string()
    .regex(/^\d*$/)
    .refine((v) => (parseInt(v) || 0) <= 100),
  people: z
    .string()
    .regex(/^\d*$/)
    .refine((v) => (parseInt(v) || 0) <= 50),
});

export type TipForm = z.infer<typeof tipFormSchema>;

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

// What each field becomes on blur: unparsable input falls back, then clamps.
export const billValueSchema = z.coerce
  .number<string>()
  .catch(0)
  .transform((n) => clamp(n, 0, 100000).toFixed(2));

export const tipValueSchema = z.coerce
  .number<string>()
  .catch(0)
  .transform((n) => String(clamp(Math.trunc(n), 0, 100)));

export const peopleValueSchema = z.coerce
  .number<string>()
  .catch(2)
  .transform((n) => String(clamp(Math.trunc(n), 2, 50)));
