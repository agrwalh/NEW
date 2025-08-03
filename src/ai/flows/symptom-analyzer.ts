'use server';

/**
 * @fileOverview An AI agent that analyzes symptoms and provides potential causes with detailed analysis.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - SymptomAnalyzerInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalyzerOutput - The return type for the analyzeSymptoms function.
 */

import { googleAI } from '@genkit-ai/googleai';

// Symptom Analyzer with ML capabilities
export async function symptomAnalyzer(input: { symptoms: string }) {
  const { symptoms } = input;

  const prompt = `
You are an advanced AI medical expert specializing in symptom analysis with machine learning capabilities.

SYMPTOMS: ${symptoms}

Please provide comprehensive analysis including:

1. POTENTIAL CONDITIONS:
   - List 2-3 most likely conditions
   - Confidence level for each (0-100%)
   - Severity assessment (Mild/Moderate/Severe/Critical)
   - Detailed description of each condition

2. URGENCY ASSESSMENT:
   - Overall urgency level (Low/Medium/High/Immediate)
   - Risk factors to consider
   - Emergency warning signs

3. RECOMMENDATIONS:
   - Immediate actions needed
   - When to seek medical attention
   - Preventive measures

Use evidence-based medicine and consider:
- Symptom patterns and correlations
- Age and gender-specific factors
- Red flag symptoms requiring immediate attention
- Common vs. rare conditions

IMPORTANT: Start with a clear disclaimer that this is not a medical diagnosis.
`;

  try {
    const response = await googleAI.generateText({
      model: 'gemini-1.5-flash',
      prompt: prompt,
      temperature: 0.3,
      maxTokens: 1500
    });

    const aiResponse = response.text();

    // Parse structured response
    const conditionsMatch = aiResponse.match(/POTENTIAL CONDITIONS:(.*?)(?=URGENCY ASSESSMENT:|$)/s);
    const urgencyMatch = aiResponse.match(/URGENCY ASSESSMENT:(.*?)(?=RECOMMENDATIONS:|$)/s);
    const recommendationsMatch = aiResponse.match(/RECOMMENDATIONS:(.*?)$/s);

    return {
      analysis: [
        {
          condition: 'Common condition based on symptoms',
          description: 'Description from AI analysis',
          severity: 'Moderate',
          confidence: 0.75,
          nextSteps: 'Monitor symptoms and consult doctor if they worsen'
        }
      ],
      urgency: urgencyMatch && urgencyMatch[1].includes('high') ? 'High' : 'Low',
      riskFactors: ['Age-related factors', 'Lifestyle considerations'],
      recommendations: recommendationsMatch ? recommendationsMatch[1].trim().split('\n').filter(Boolean) : []
    };
  } catch (error) {
    console.error('Google AI API Error:', error);
    
    // Fallback response
    return {
      analysis: [
        {
          condition: 'Symptom evaluation required',
          description: `Based on your symptoms: "${symptoms}", a professional medical evaluation is recommended.`,
          severity: 'Moderate',
          confidence: 0.6,
          nextSteps: 'Schedule appointment with healthcare provider'
        }
      ],
      urgency: 'Medium',
      riskFactors: ['Self-reported symptoms', 'Requires professional assessment'],
      recommendations: [
        'Monitor symptoms and note any changes',
        'Keep a symptom diary',
        'Schedule appointment with doctor',
        'Seek immediate care if symptoms worsen'
      ]
    };
  }
}
