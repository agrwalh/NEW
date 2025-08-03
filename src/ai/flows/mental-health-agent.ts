
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

  // Check if language instruction is in the message
  const languageMatch = prompt.match(/Please respond in (.+?) \((.+?)\)\./);
  let targetLanguage = 'English';
  let languageCode = 'en-US';
  
  if (languageMatch) {
    targetLanguage = languageMatch[1];
    languageCode = languageMatch[2];
  }

  const promptText = `
You are a warm, empathetic, and non-judgmental AI mental health companion with advanced emotional intelligence capabilities.

IMPORTANT: You MUST respond in ${targetLanguage} (${languageCode}). Do not use English unless specifically requested.

USER PROFILE:
- Age: ${userProfile?.age || 'Not specified'}
- Gender: ${userProfile?.gender || 'Not specified'}
- Stress Level: ${userProfile?.stressLevel || 'Not specified'}
- Sleep Quality: ${userProfile?.sleepQuality || 'Not specified'}

CONVERSATION HISTORY:
${history?.map(msg => `- ${msg}`).join('\n') || 'No previous conversation'}

CURRENT MESSAGE: "${prompt.replace(/Please respond in .+? \(.+?\)\. /, '')}"

Please provide comprehensive mental health support in ${targetLanguage} including:

1. EMOTIONAL RESPONSE (in ${targetLanguage}):
   - Empathetic and supportive response
   - Validation of feelings
   - Gentle, reflective questions

2. MOOD ASSESSMENT (in ${targetLanguage}):
   - Current emotional state analysis
   - Stress level evaluation
   - Mood trend identification

3. COPING STRATEGIES (in ${targetLanguage}):
   - Practical stress management techniques
   - Mindfulness exercises
   - Lifestyle recommendations

4. RECOMMENDATIONS (in ${targetLanguage}):
   - Self-care suggestions
   - When to seek professional help
   - Support resources

Use evidence-based mental health principles and maintain a supportive, non-judgmental tone.

Remember: Always respond in ${targetLanguage}, not in English.
`;

  try {
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
      response: responseMatch ? responseMatch[1].trim() : aiResponse,
      mood: moodMatch && moodMatch[1].includes('negative') ? 'Negative' : 'Neutral',
      stressLevel: userProfile?.stressLevel || 'Medium',
      recommendations: recommendationsMatch ? recommendationsMatch[1].trim().split('\n').filter(Boolean) : [],
      copingStrategies: copingMatch ? copingMatch[1].trim().split('\n').filter(Boolean) : []
    };
  } catch (error) {
    console.error('Google AI API Error:', error);
    
    // Fallback response in the selected language
    const fallbackResponses = {
      'hi-IN': `मैं आपकी बात सुन रहा हूं और आपका समर्थन करने के लिए यहां हूं।

आपके संदेश के लिए धन्यवाद। मैं आपकी भावनाओं को समझता हूं और आपको सहायता प्रदान करने के लिए तैयार हूं।

**मेरी सलाह:**
- अपनी भावनाओं को स्वीकार करें
- अपने आप पर दया करें
- जरूरत पड़ने पर पेशेवर मदद लें

याद रखें: मैं यहां आपकी मदद के लिए हूं।`,
      'es-ES': `Te escucho y estoy aquí para apoyarte.

Gracias por tu mensaje. Entiendo tus sentimientos y estoy aquí para ayudarte.

**Mi consejo:**
- Acepta tus emociones
- Sé amable contigo mismo
- Busca ayuda profesional si la necesitas

Recuerda: Estoy aquí para ayudarte.`,
      'fr-FR': `Je t'écoute et je suis là pour te soutenir.

Merci pour ton message. Je comprends tes sentimientos y je suis là pour t'aider.

**Mon conseil:**
- Accepte tes émotions
- Sois gentil avec toi-même
- Demande de l'aide professionnelle si nécessaire

Rappelle-toi: Je suis là pour t'aider.`,
      'default': `I hear you and I'm here to support you.

Thank you for your message. I understand your feelings and I'm here to help.

**My advice:**
- Accept your emotions
- Be kind to yourself
- Seek professional help if needed

Remember: I'm here to help.`
    };

    const fallbackResponse = fallbackResponses[languageCode as keyof typeof fallbackResponses] || fallbackResponses.default;
    
    return {
      response: fallbackResponse,
      mood: 'Neutral',
      stressLevel: userProfile?.stressLevel || 'Medium',
      recommendations: ['Practice self-care', 'Stay connected with loved ones'],
      copingStrategies: ['Deep breathing exercises', 'Mindfulness meditation']
    };
  }
}
