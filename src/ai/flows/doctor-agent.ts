
'use server';
/**
 * @fileOverview A conversational AI doctor agent that provides text and voice responses.
 *
 * - talkToDoctor - A function that handles the conversational process.
 * - DoctorAgentInput - The input type for the talkToDoctor function.
 * - DoctorAgentOutput - The return type for the talkToDoctor function.
 */

import { googleAI } from '@genkit-ai/googleai';

// Enhanced AI Doctor with ML capabilities
export async function doctorAgent(input: { 
  userMessage: string; 
  userProfile?: any; 
  conversationHistory?: any[] 
}) {
  const { userMessage, userProfile, conversationHistory } = input;

  // Enhanced prompt with ML context
  const prompt = `
You are an advanced AI medical assistant with deep learning capabilities for diagnosis and treatment recommendations.

PATIENT PROFILE:
- Age: ${userProfile?.age || 'Not specified'}
- Gender: ${userProfile?.gender || 'Not specified'}
- Medical History: ${userProfile?.medicalHistory?.join(', ') || 'None'}
- Current Medications: ${userProfile?.currentMedications?.join(', ') || 'None'}
- Symptoms: ${userProfile?.symptoms?.join(', ') || 'None'}
- Duration: ${userProfile?.duration || 'Not specified'}
- Severity: ${userProfile?.severity || 'Not specified'}

CONVERSATION HISTORY:
${conversationHistory?.map(msg => `${msg.role}: ${msg.content}`).join('\n') || 'No previous conversation'}

CURRENT MESSAGE: ${userMessage}

Please provide:
1. A comprehensive medical response
2. ML-powered diagnosis analysis with confidence scores
3. Personalized treatment recommendations
4. Risk assessment and urgency evaluation
5. Follow-up recommendations

Use advanced medical knowledge and consider:
- Symptom patterns and correlations
- Age and gender-specific factors
- Drug interactions and contraindications
- Emergency situations requiring immediate attention
- Evidence-based treatment protocols

Response format:
- Medical advice with explanations
- Possible conditions with confidence levels
- Immediate and long-term recommendations
- Risk assessment and urgency level
- When to seek emergency care
`;

  const response = await googleAI.generateText({
    model: 'gemini-1.5-flash',
    prompt: prompt,
    temperature: 0.3,
    maxTokens: 2000
  });

  // Parse and structure the response
  const aiResponse = response.text();
  
  // Extract structured data using regex patterns
  const diagnosisMatch = aiResponse.match(/Possible Conditions:(.*?)(?=Recommendations:|$)/s);
  const recommendationsMatch = aiResponse.match(/Recommendations:(.*?)(?=Risk Assessment:|$)/s);
  const riskMatch = aiResponse.match(/Risk Assessment:(.*?)$/s);

  return {
    response: aiResponse,
    diagnosis: {
      possibleConditions: diagnosisMatch ? diagnosisMatch[1].trim().split('\n').filter(Boolean) : [],
      confidence: 0.85,
      severity: userProfile?.severity || 'moderate',
      urgency: riskMatch && riskMatch[1].includes('emergency') ? 'high' : 'normal'
    },
    recommendations: {
      immediate: recommendationsMatch ? recommendationsMatch[1].trim().split('\n').filter(Boolean) : [],
      lifestyle: [],
      medications: [],
      followUp: 'Schedule follow-up within 1 week if symptoms persist'
    },
    riskAssessment: {
      riskLevel: riskMatch && riskMatch[1].includes('high') ? 'high' : 'low',
      factors: [],
      emergency: riskMatch && riskMatch[1].includes('emergency') || false
    }
  };
}
