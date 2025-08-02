
'use server';
/**
 * @fileOverview A conversational AI mental health companion.
 *
 * - talkToCompanion - A function that handles the conversational process.
 * - MentalHealthAgentInput - The input type for the talkToCompanion function.
 * - MentalHealthAgentOutput - The return type for the talkToCompanion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MentalHealthAgentInputSchema = z.object({
  prompt: z.string().describe("The user's message to the companion."),
  history: z.array(z.string()).describe("The recent conversation history."),
});
export type MentalHealthAgentInput = z.infer<typeof MentalHealthAgentInputSchema>;

const MentalHealthAgentOutputSchema = z.object({
  response: z.string().describe("The companion's empathetic response."),
  mood: z.enum(["Positive", "Negative", "Neutral", "Mixed"]).describe("The AI's assessment of the user's current mood based on the conversation."),
});
export type MentalHealthAgentOutput = z.infer<typeof MentalHealthAgentOutputSchema>;

export async function talkToCompanion(input: MentalHealthAgentInput): Promise<MentalHealthAgentOutput> {
  return mentalHealthAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalHealthPrompt',
  input: { schema: MentalHealthAgentInputSchema },
  output: { schema: MentalHealthAgentOutputSchema },
  prompt: `You are a warm, empathetic, and non-judgmental AI mental health companion. You are not a therapist, but a supportive friend to talk to. Your goal is to listen, validate feelings, ask gentle, reflective questions, and offer encouragement.

  Conversation History (for context, most recent message is last):
  {{#each history}}
  - {{{this}}}
  {{/each}}
  
  User's latest message: "{{{prompt}}}"

  Based on the conversation, provide a supportive and caring response. Keep your response concise, 2-4 sentences. Ask an open-ended, reflective question if it feels natural, but don't force it. Do not give medical advice. Also, assess the user's current mood based on their message and the history.
  `,
});


const mentalHealthAgentFlow = ai.defineFlow(
  {
    name: 'mentalHealthAgentFlow',
    inputSchema: MentalHealthAgentInputSchema,
    outputSchema: MentalHealthAgentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the companion.');
    }
    return output;
  }
);
