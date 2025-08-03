
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

  // Check if language instruction is in the message
  const languageMatch = userMessage.match(/Please respond in (.+?) \((.+?)\)\./);
  let targetLanguage = 'English';
  let languageCode = 'en-US';
  
  if (languageMatch) {
    targetLanguage = languageMatch[1];
    languageCode = languageMatch[2];
  }

  // Enhanced prompt with ML context and language instruction
  const prompt = `
You are an advanced AI medical assistant with deep learning capabilities for diagnosis and treatment recommendations.

IMPORTANT: You MUST respond in ${targetLanguage} (${languageCode}). Do not use English unless specifically requested.

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

CURRENT MESSAGE: ${userMessage.replace(/Please respond in .+? \(.+?\)\. /, '')}

Please provide a comprehensive medical response in ${targetLanguage} including:

1. A detailed medical response in ${targetLanguage}
2. ML-powered diagnosis analysis with confidence scores
3. Personalized treatment recommendations in ${targetLanguage}
4. Risk assessment and urgency evaluation
5. Follow-up recommendations in ${targetLanguage}

Use advanced medical knowledge and consider:
- Symptom patterns and correlations
- Age and gender-specific factors
- Drug interactions and contraindications
- Emergency situations requiring immediate attention
- Evidence-based treatment protocols

Response format (in ${targetLanguage}):
- Medical advice with explanations
- Possible conditions with confidence levels
- Immediate and long-term recommendations
- Risk assessment and urgency level
- When to seek emergency care

Remember: Always respond in ${targetLanguage}, not in English.
`;

  try {
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
  } catch (error) {
    console.error('Google AI API Error:', error);
    
    // Fallback response in the selected language
    const fallbackResponses = {
      'hi-IN': `आपके लक्षणों के लिए धन्यवाद: "${userMessage.replace(/Please respond in .+? \(.+?\)\. /, '')}"

आपके विवरण के आधार पर, मैं कुछ सामान्य मार्गदर्शन प्रदान कर सकता हूं, लेकिन कृपया ध्यान दें कि यह चिकित्सीय निदान नहीं है और आपको उचित मूल्यांकन के लिए स्वास्थ्य देखभाल पेशेवर से परामर्श करना चाहिए।

**सामान्य सिफारिशें:**
- अपने लक्षणों की निगरानी करें और किसी भी बदलाव को नोट करें
- समय और गंभीरता के साथ लक्षण डायरी रखें
- हाइड्रेटेड रहें और पर्याप्त आराम करें
- पेशेवर सलाह के बिना स्व-दवा से बचें

**चिकित्सीय ध्यान कब लें:**
- यदि लक्षण बिगड़ते हैं या कुछ दिनों से अधिक समय तक बने रहते हैं
- यदि आप गंभीर दर्द, बुखार या अन्य चिंताजनक लक्षणों का अनुभव करते हैं
- यदि लक्षण दैनिक गतिविधियों में हस्तक्षेप करते हैं

**अगले कदम:**
कृपया अपने स्वास्थ्य देखभाल प्रदाता के साथ नियुक्ति शेड्यूल करें। वे उचित मूल्यांकन, आकलन और उपचार सिफारिशें प्रदान कर सकते हैं।

याद रखें: यह AI सहायक केवल सूचनात्मक उद्देश्यों के लिए है और पेशेवर चिकित्सीय सलाह को प्रतिस्थापित नहीं कर सकता।`,
      'es-ES': `Gracias por compartir tus síntomas: "${userMessage.replace(/Please respond in .+? \(.+?\)\. /, '')}"

Basándome en tu descripción, puedo proporcionar algunas pautas generales, pero ten en cuenta que esto no es un diagnóstico médico y debes consultar con un profesional de la salud para una evaluación adecuada.

**Recomendaciones Generales:**
- Monitorea tus síntomas y anota cualquier cambio
- Mantén un diario de síntomas con tiempo y severidad
- Mantente hidratado y descansa adecuadamente
- Evita la automedicación sin consejo profesional

**Cuándo Buscar Atención Médica:**
- Si los síntomas empeoran o persisten por más de unos días
- Si experimentas dolor severo, fiebre u otros síntomas preocupantes
- Si los síntomas interfieren con las actividades diarias

**Próximos Pasos:**
Por favor agenda una cita con tu proveedor de salud. Ellos pueden proporcionar una evaluación adecuada, evaluación y recomendaciones de tratamiento.

Recuerda: Este asistente de IA es solo para propósitos informativos y no puede reemplazar el consejo médico profesional.`,
      'fr-FR': `Merci de partager vos symptômes: "${userMessage.replace(/Please respond in .+? \(.+?\)\. /, '')}"

Basé sur votre description, je peux fournir quelques conseils généraux, mais veuillez noter que ceci n'est pas un diagnostic médical et vous devriez consulter un professionnel de la santé pour une évaluation appropriée.

**Recommandations Générales:**
- Surveillez vos symptômes et notez tout changement
- Tenez un journal des symptômes avec timing et sévérité
- Restez hydraté et reposez-vous suffisamment
- Évitez l'automédication sans conseil professionnel

**Quand Chercher des Soins Médicaux:**
- Si les symptômes s'aggravent ou persistent pendant plus de quelques jours
- Si vous ressentez une douleur sévère, de la fièvre ou d'autres symptômes inquiétants
- Si les symptômes interfèrent avec les activités quotidiennes

**Prochaines Étapes:**
Veuillez programmer un rendez-vous avec votre fournisseur de soins de santé. Ils peuvent fournir une évaluation appropriée, une évaluation et des recommandations de traitement.

Rappelez-vous: Cet assistant IA est uniquement à des fins informatives et ne peut pas remplacer les conseils médicaux professionnels.`,
      'default': `Thank you for sharing your symptoms: "${userMessage.replace(/Please respond in .+? \(.+?\)\. /, '')}"

Based on your description, I can provide some general guidance, but please note that this is not a medical diagnosis and you should consult with a healthcare professional for proper evaluation.

**General Recommendations:**
- Monitor your symptoms and note any changes
- Keep a symptom diary with timing and severity
- Stay hydrated and get adequate rest
- Avoid self-medication without professional advice

**When to Seek Medical Attention:**
- If symptoms worsen or persist for more than a few days
- If you experience severe pain, fever, or other concerning symptoms
- If symptoms interfere with daily activities

**Next Steps:**
Please schedule an appointment with your healthcare provider. They can provide a thorough assessment and appropriate treatment recommendations.

Remember: This AI assistant is for informational purposes only and cannot replace professional medical advice.`
    };

    const fallbackResponse = fallbackResponses[languageCode as keyof typeof fallbackResponses] || fallbackResponses.default;
    
    return {
      response: fallbackResponse,
      diagnosis: {
        possibleConditions: ['Requires professional evaluation'],
        confidence: 0.5,
        severity: userProfile?.severity || 'moderate',
        urgency: 'normal'
      },
      recommendations: {
        immediate: ['Monitor symptoms', 'Stay hydrated', 'Get adequate rest'],
        lifestyle: ['Maintain healthy habits', 'Avoid stress'],
        medications: [],
        followUp: 'Schedule appointment with healthcare provider'
      },
      riskAssessment: {
        riskLevel: 'low',
        factors: ['Self-reported symptoms'],
        emergency: false
      }
    };
  }
}
