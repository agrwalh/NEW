
'use server';
/**
 * @fileOverview Provides detailed information about a specific medication.
 *
 * - getMedicineInfo - A function that handles the medicine information retrieval process.
 * - MedicineInfoInput - The input type for the getMedicineInfo function.
 * - MedicineInfoOutput - The return type for the getMedicineInfo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MedicineInfoInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to get information about.'),
});
export type MedicineInfoInput = z.infer<typeof MedicineInfoInputSchema>;

const MedicineInfoOutputSchema = z.object({
  usage: z.string().describe("What the medicine is typically used for."),
  dosage: z.string().describe("General information about the medicine's dosage."),
  sideEffects: z.string().describe("Common side effects associated with the medicine."),
  precautions: z.string().describe("Important precautions and warnings for the medicine."),
  disclaimer: z.string().describe("A standard disclaimer that this is not medical advice."),
});
export type MedicineInfoOutput = z.infer<typeof MedicineInfoOutputSchema>;

export async function getMedicineInfo(input: MedicineInfoInput): Promise<MedicineInfoOutput> {
  return medicineInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicineInfoPrompt',
  input: { schema: MedicineInfoInputSchema },
  output: { schema: MedicineInfoOutputSchema },
  prompt: `You are a helpful medical assistant. Provide detailed information about the following medication: {{{medicineName}}}.

  Structure your response to cover the following areas:
  - **Usage**: What is this medicine used for?
  - **Dosage**: What is the general dosage information?
  - **Side Effects**: What are the common side effects?
  - **Precautions**: What are the important precautions and warnings?

  IMPORTANT: Include a clear disclaimer that this information is for educational purposes only and is not a substitute for professional medical advice. Users must consult a healthcare provider for any health concerns or before taking any medication.
  `,
});

const medicineInfoFlow = ai.defineFlow(
  {
    name: 'medicineInfoFlow',
    inputSchema: MedicineInfoInputSchema,
    outputSchema: MedicineInfoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get information for the specified medicine.');
    }
    return output;
  }
);
