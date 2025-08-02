
'use server';
/**
 * @fileOverview An AI agent that analyzes images of skin lesions.
 *
 * - analyzeSkinLesion - A function that handles the skin lesion analysis process.
 * - SkinLesionAnalyzerInput - The input type for the analyzeSkinLesion function.
 * - SkinLesionAnalyzerOutput - The return type for the analyzeSkinLesion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkinLesionAnalyzerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a skin lesion, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SkinLesionAnalyzerInput = z.infer<typeof SkinLesionAnalyzerInputSchema>;

const SkinLesionAnalyzerOutputSchema = z.object({
  potentialCondition: z.string().describe("The most likely potential condition for the skin lesion."),
  description: z.string().describe("A brief description of the condition and an assessment of its urgency (e.g., 'Low urgency, but monitor for changes.')"),
  nextSteps: z.string().describe("Recommended next steps for the user, such as consulting a dermatologist or monitoring the lesion."),
});
export type SkinLesionAnalyzerOutput = z.infer<typeof SkinLesionAnalyzerOutputSchema>;

export async function analyzeSkinLesion(input: SkinLesionAnalyzerInput): Promise<SkinLesionAnalyzerOutput> {
  return skinLesionAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skinLesionAnalyzerPrompt',
  input: { schema: SkinLesionAnalyzerInputSchema },
  output: { schema: SkinLesionAnalyzerOutputSchema },
  prompt: `You are a dermatology assistant AI. Your role is to provide a preliminary analysis of a skin lesion based on an uploaded image. You are not a medical professional and your analysis is not a diagnosis.

  Analyze the provided image of a skin lesion. Based on the visual information, identify the most likely potential condition. Provide a brief, easy-to-understand description of that condition, assess the likely urgency, and suggest clear, actionable next steps for the user.
  
  IMPORTANT: Start your response with a clear disclaimer that this is not a medical diagnosis and a healthcare professional should be consulted.

  Photo: {{media url=photoDataUri}}
  `,
});

const skinLesionAnalyzerFlow = ai.defineFlow(
  {
    name: 'skinLesionAnalyzerFlow',
    inputSchema: SkinLesionAnalyzerInputSchema,
    outputSchema: SkinLesionAnalyzerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Analysis failed to generate a response.');
    }
    return output;
  }
);
