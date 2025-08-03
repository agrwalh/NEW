import { googleAI } from '@genkit-ai/googleai';

// Medical Summarizer with ML capabilities
export async function medicalSummarizer(input: { topic: string }) {
  const { topic } = input;

  const prompt = `
You are an advanced AI medical research assistant with expertise in summarizing complex medical topics.

TOPIC: ${topic}

Please provide comprehensive analysis including:

1. SUMMARY:
   - Concise overview of the topic
   - Key medical concepts explained
   - Current understanding and research

2. KEY POINTS:
   - Important facts and findings
   - Clinical significance
   - Treatment approaches if applicable

3. SOURCE LINKS:
   - Reputable medical sources
   - Research papers and studies
   - Clinical guidelines

4. RELATED TOPICS:
   - Connected medical concepts
   - Areas for further research
   - Related conditions or treatments

Use evidence-based medicine and provide accurate, up-to-date information.
`;

  const response = await googleAI.generateText({
    model: 'gemini-1.5-flash',
    prompt: prompt,
    temperature: 0.3,
    maxTokens: 1500
  });

  const aiResponse = response.text();

  // Parse structured response
  const summaryMatch = aiResponse.match(/SUMMARY:(.*?)(?=KEY POINTS:|$)/s);
  const keyPointsMatch = aiResponse.match(/KEY POINTS:(.*?)(?=SOURCE LINKS:|$)/s);
  const sourceLinksMatch = aiResponse.match(/SOURCE LINKS:(.*?)(?=RELATED TOPICS:|$)/s);
  const relatedTopicsMatch = aiResponse.match(/RELATED TOPICS:(.*?)$/s);

  return {
    summary: summaryMatch ? summaryMatch[1].trim() : 'Summary of medical topic',
    keyPoints: keyPointsMatch ? keyPointsMatch[1].trim().split('\n').filter(Boolean) : [],
    sourceLinks: [
      'https://www.mayoclinic.org/search/search-results?q=' + encodeURIComponent(topic),
      'https://medlineplus.gov/search.html?query=' + encodeURIComponent(topic),
      'https://www.ncbi.nlm.nih.gov/pubmed/?term=' + encodeURIComponent(topic)
    ],
    relatedTopics: relatedTopicsMatch ? relatedTopicsMatch[1].trim().split('\n').filter(Boolean) : []
  };
}
