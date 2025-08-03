
'use server';
/**
 * @fileOverview A conversational AI mental health companion.
 *
 * - talkToCompanion - A function that handles the conversational process.
 * - MentalHealthAgentInput - The input type for the talkToCompanion function.
 * - MentalHealthAgentOutput - The return type for the talkToCompanion function.
 */

import { googleAI } from '@genkit-ai/googleai';

// Mental Health Agent with ML capabilities
export async function mentalHealthAgent(input: {
  prompt: string;
  history?: string[];
  userProfile?: any;
}) {
  const { prompt, history, userProfile } = input;

  const promptText = `
You are a warm, empathetic, and non-judgmental AI mental health companion with advanced emotional intelligence capabilities.

USER PROFILE:
- Age: ${userProfile?.age || 'Not specified'}
- Gender: ${userProfile?.gender || 'Not specified'}
- Stress Level: ${userProfile?.stressLevel || 'Not specified'}
- Sleep Quality: ${userProfile?.sleepQuality || 'Not specified'}

CONVERSATION HISTORY:
${history?.map(msg => `- ${msg}`).join('\n') || 'No previous conversation'}

CURRENT MESSAGE: "${prompt}"

Please provide comprehensive mental health support including:

1. EMOTIONAL RESPONSE:
   - Empathetic and supportive response
   - Validation of feelings
   - Gentle, reflective questions

2. MOOD ASSESSMENT:
   - Current emotional state analysis
   - Stress level evaluation
   - Mood trend identification

3. COPING STRATEGIES:
   - Practical stress management techniques
   - Mindfulness exercises
   - Lifestyle recommendations

4. RECOMMENDATIONS:
   - Self-care suggestions
   - When to seek professional help
   - Support resources

Use evidence-based mental health principles and maintain a supportive, non-judgmental tone.
`;

  const response = await googleAI.generateText({
    model: 'gemini-1.5-flash',
    prompt: promptText,
    temperature: 0.7,
    maxTokens: 1000
  });

  const aiResponse = response.text();

  // Parse structured response
  const responseMatch = aiResponse.match(/EMOTIONAL RESPONSE:(.*?)(?=MOOD ASSESSMENT:|$)/s);
  const moodMatch = aiResponse.match(/MOOD ASSESSMENT:(.*?)(?=COPING STRATEGIES:|$)/s);
  const copingMatch = aiResponse.match(/COPING STRATEGIES:(.*?)(?=RECOMMENDATIONS:|$)/s);
  const recommendationsMatch = aiResponse.match(/RECOMMENDATIONS:(.*?)$/s);

  return {
    response: responseMatch ? responseMatch[1].trim() : 'I hear you and I\'m here to support you.',
    mood: moodMatch && moodMatch[1].includes('negative') ? 'Negative' : 'Neutral',
    stressLevel: userProfile?.stressLevel || 'Medium',
    recommendations: recommendationsMatch ? recommendationsMatch[1].trim().split('\n').filter(Boolean) : [],
    copingStrategies: copingMatch ? copingMatch[1].trim().split('\n').filter(Boolean) : []
  };
}
