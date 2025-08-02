
'use server';
/**
 * @fileOverview A conversational AI doctor agent that provides text and voice responses.
 *
 * - talkToDoctor - A function that handles the conversational process.
 * - DoctorAgentInput - The input type for the talkToDoctor function.
 * - DoctorAgentOutput - The return type for the talkToDoctor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const DoctorAgentInputSchema = z.object({
  prompt: z.string().describe('The user\'s question or statement to the doctor.'),
});
export type DoctorAgentInput = z.infer<typeof DoctorAgentInputSchema>;

const DoctorAgentOutputSchema = z.object({
  response: z.string().describe('The doctor\'s text response.'),
  audioUrl: z.string().describe("The doctor's audio response as a data URI."),
});
export type DoctorAgentOutput = z.infer<typeof DoctorAgentOutputSchema>;

export async function talkToDoctor(input: DoctorAgentInput): Promise<DoctorAgentOutput> {
  return doctorAgentFlow(input);
}

async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}

const doctorAgentFlow = ai.defineFlow(
  {
    name: 'doctorAgentFlow',
    inputSchema: DoctorAgentInputSchema,
    outputSchema: DoctorAgentOutputSchema,
  },
  async (input) => {
    // Generate the text response
    const llmResponse = await ai.generate({
      prompt: `You are a helpful and empathetic AI doctor. A user is talking to you. Provide a concise and helpful response with precautions if applicable. Keep your response to 2-3 sentences.
      
      IMPORTANT: Do not start your response with "As an AI doctor" or any similar disclaimer. Just provide the medical information directly. Be friendly and conversational.

      User's message: "${input.prompt}"`,
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.7,
      },
    });
    
    const doctorText = llmResponse.text;
    
    // Generate the audio response
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A calm, professional voice
          },
        },
      },
      prompt: doctorText,
    });

    if (!media) {
      throw new Error('Audio generation failed.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      response: doctorText,
      audioUrl: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
