'use server';

/**
 * @fileOverview An AI agent that analyzes symptoms and provides potential causes.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - SymptomAnalyzerInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalyzerOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAnalyzerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A list of symptoms the user is experiencing.'),
});
export type SymptomAnalyzerInput = z.infer<typeof SymptomAnalyzerInputSchema>;

const SymptomAnalyzerOutputSchema = z.object({
  potentialCauses: z
    .string()
    .describe('A list of potential causes for the symptoms.'),
});
export type SymptomAnalyzerOutput = z.infer<typeof SymptomAnalyzerOutputSchema>;

export async function analyzeSymptoms(input: SymptomAnalyzerInput): Promise<SymptomAnalyzerOutput> {
  return symptomAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalyzerPrompt',
  input: {schema: SymptomAnalyzerInputSchema},
  output: {schema: SymptomAnalyzerOutputSchema},
  prompt: `You are a medical expert specializing in symptom analysis.

You will use the following information to determine potential causes for the symptoms.

Symptoms: {{{symptoms}}}

Provide a list of potential causes for the symptoms.
`,
});

const symptomAnalyzerFlow = ai.defineFlow(
  {
    name: 'symptomAnalyzerFlow',
    inputSchema: SymptomAnalyzerInputSchema,
    outputSchema: SymptomAnalyzerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
