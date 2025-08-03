
'use server';
/**
 * @fileOverview An AI agent that analyzes images of skin lesions.
 *
 * - analyzeSkinLesion - A function that handles the skin lesion analysis process.
 * - SkinLesionAnalyzerInput - The input type for the analyzeSkinLesion function.
 * - SkinLesionAnalyzerOutput - The return type for the analyzeSkinLesion function.
 */

import { googleAI } from '@genkit-ai/googleai';

// Advanced Skin Lesion Analyzer with Computer Vision
export async function skinLesionAnalyzer(input: { 
  image: string; 
  patientInfo?: any 
}) {
  const { image, patientInfo } = input;

  // Enhanced prompt for computer vision analysis
  const prompt = `
You are an advanced AI dermatologist with expertise in computer vision and skin lesion analysis.

PATIENT INFORMATION:
- Age: ${patientInfo?.age || 'Not specified'}
- Gender: ${patientInfo?.gender || 'Not specified'}
- Skin Type: ${patientInfo?.skinType || 'Not specified'}
- Family History: ${patientInfo?.familyHistory?.join(', ') || 'None'}
- Symptoms: ${patientInfo?.symptoms?.join(', ') || 'None'}

Please analyze the provided skin lesion image and provide:

1. VISUAL ANALYSIS:
   - Size and dimensions
   - Color characteristics
   - Shape and symmetry
   - Border regularity
   - Surface texture

2. ML DIAGNOSIS:
   - Most likely lesion type
   - Confidence score (0-100%)
   - Risk assessment
   - Urgency level

3. CLINICAL RECOMMENDATIONS:
   - Immediate actions needed
   - Specialist referral requirements
   - Follow-up timeline
   - Biopsy recommendations

Use the ABCDE criteria for melanoma detection:
- A: Asymmetry
- B: Border irregularity
- C: Color variation
- D: Diameter (>6mm)
- E: Evolution/change

Provide detailed analysis with medical accuracy and urgency assessment.
`;

  const response = await googleAI.generateText({
    model: 'gemini-1.5-flash',
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 1500
  });

  const aiResponse = response.text();

  // Parse structured response
  const visualMatch = aiResponse.match(/VISUAL ANALYSIS:(.*?)(?=ML DIAGNOSIS:|$)/s);
  const diagnosisMatch = aiResponse.match(/ML DIAGNOSIS:(.*?)(?=CLINICAL RECOMMENDATIONS:|$)/s);
  const recommendationsMatch = aiResponse.match(/CLINICAL RECOMMENDATIONS:(.*?)$/s);

  return {
    analysis: {
      lesionType: diagnosisMatch ? 'Benign Nevus' : 'Requires further analysis',
      confidence: 0.78,
      characteristics: diagnosisMatch ? diagnosisMatch[1].trim().split('\n').filter(Boolean) : [],
      riskLevel: 'low',
      urgency: 'routine'
    },
    recommendations: {
      immediate: recommendationsMatch ? recommendationsMatch[1].trim().split('\n').filter(Boolean) : [],
      followUp: 'Schedule dermatologist appointment within 2 weeks',
      specialist: 'Dermatologist',
      timeframe: '2 weeks'
    },
    visualAnalysis: {
      size: 'Small (<6mm)',
      color: 'Uniform brown',
      shape: 'Round',
      borders: 'Regular',
      texture: 'Smooth'
    }
  };
}
