
'use server';
/**
 * @fileOverview An AI agent that generates a sample medical prescription based on symptoms.
 *
 * - generatePrescription - A function that handles the prescription generation process.
 * - PrescriptionGeneratorInput - The input type for the generatePrescription function.
 * - PrescriptionGeneratorOutput - The return type for the generatePrescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PrescriptionGeneratorInputSchema = z.object({
  name: z.string().describe("The user's full name."),
  age: z.number().describe("The user's age in years."),
  gender: z.enum(['Male', 'Female', 'Other']).describe("The user's gender."),
  symptoms: z.string().describe('A detailed description of the symptoms the user is experiencing.'),
});
export type PrescriptionGeneratorInput = z.infer<typeof PrescriptionGeneratorInputSchema>;

const MedicineSchema = z.object({
  name: z.string().describe('The name of the medicine.'),
  dosage: z.string().describe('The dosage of the medicine (e.g., "500mg", "10ml").'),
  frequency: z.string().describe('How often to take the medicine (e.g., "Twice a day", "Before bed").'),
  duration: z.string().describe('For how long to take the medicine (e.g., "7 days", "As needed").'),
});

const PrescriptionGeneratorOutputSchema = z.object({
  patientName: z.string(),
  age: z.number(),
  gender: z.string(),
  date: z.string().describe('The date the prescription is generated, in "Month Day, Year" format.'),
  diagnosis: z.string().describe('A likely diagnosis based on the symptoms.'),
  medicines: z.array(MedicineSchema).describe('A list of recommended medicines. Provide at least 2-3 appropriate medications.'),
  precautions: z.array(z.string()).describe('A list of general precautions or lifestyle advice. Provide at least 2-3 recommendations.'),
  disclaimer: z.string().describe('A strong disclaimer stating this is not a real prescription and a doctor must be consulted.'),
});
export type PrescriptionGeneratorOutput = z.infer<typeof PrescriptionGeneratorOutputSchema>;

export async function generatePrescription(input: PrescriptionGeneratorInput): Promise<PrescriptionGeneratorOutput> {
  return prescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prescriptionGeneratorPrompt',
  input: { schema: PrescriptionGeneratorInputSchema },
  output: { schema: PrescriptionGeneratorOutputSchema },
  prompt: `You are an AI medical assistant. Your task is to generate a sample prescription based on the patient's information and symptoms.

  Patient Information:
  - Name: {{{name}}}
  - Age: {{{age}}}
  - Gender: {{{gender}}}
  - Symptoms: {{{symptoms}}}

  Based on the symptoms, provide a likely diagnosis and generate a sample prescription. The prescription should include appropriate medications with dosage, frequency, and duration. Also, include a list of general precautions and lifestyle advice.

  IMPORTANT: You must include a strong, clear disclaimer at the end. The disclaimer must state that this is an AI-generated sample, not a real medical prescription, and that the user MUST consult a qualified healthcare professional before taking any medication or making any health decisions.
  `,
});

const prescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'prescriptionGeneratorFlow',
    inputSchema: PrescriptionGeneratorInputSchema,
    outputSchema: PrescriptionGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Prescription generation failed.');
    }
    return output;
  }
);
