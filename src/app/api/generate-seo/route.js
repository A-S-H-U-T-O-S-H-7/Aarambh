import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Helper to clean HTML content
function cleanHtmlContent(html) {
  if (!html) return '';
  let text = html.replace(/<[^>]*>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&[a-z]+;/gi, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

export async function POST(request) {
  try {
    const { content } = await request.json();
    
    const cleanContent = cleanHtmlContent(content);
    
    if (!cleanContent || cleanContent.length < 20) {
      return NextResponse.json({
        success: false,
        error: "Please add at least 20 characters of content first"
      });
    }
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are an SEO expert for spiritual/religious content. Analyze the following story content and generate SEO metadata.

Story Content: ${cleanContent.substring(0, 3000)}

Generate a JSON response with these exact fields (no extra text, no markdown):

{
  "metatitle": "50-60 character SEO title in Hindi",
  "metadesc": "150-160 character SEO description in Hindi",
  "metakeywords": "8-10 comma-separated keywords in Hindi",
  "tags": "5-6 comma-separated lowercase tags in Hindi (use hyphens for multi-word tags)",
  "shortDescription": "A 2-3 sentence summary in Hindi (max 200 characters)",
  "moral": "The moral or lesson of the story in Hindi (max 150 characters)"
}

Important Rules:
- metatitle: 50-60 chars exactly, must be in Hindi, include main keyword
- metadesc: 150-160 chars exactly, must be in Hindi
- metakeywords: Exactly 8-10 Hindi keywords separated by commas
- tags: Exactly 5-6 lowercase Hindi tags separated by commas, use hyphens for multi-word tags
- shortDescription: 2-3 sentences in Hindi, max 200 characters
- moral: The main lesson from the story in Hindi, max 150 characters

Return ONLY valid JSON, no markdown, no extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean the response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Fallback parsing with regex
      const titleMatch = responseText.match(/"metatitle"\s*:\s*"([^"]+)"/);
      const descMatch = responseText.match(/"metadesc"\s*:\s*"([^"]+)"/);
      const keywordsMatch = responseText.match(/"metakeywords"\s*:\s*"([^"]+)"/);
      const tagsMatch = responseText.match(/"tags"\s*:\s*"([^"]+)"/);
      const shortDescMatch = responseText.match(/"shortDescription"\s*:\s*"([^"]+)"/);
      const moralMatch = responseText.match(/"moral"\s*:\s*"([^"]+)"/);
      
      parsed = {
        metatitle: titleMatch ? titleMatch[1] : cleanContent.substring(0, 55),
        metadesc: descMatch ? descMatch[1] : cleanContent.substring(0, 155),
        metakeywords: keywordsMatch ? keywordsMatch[1] : "आध्यात्मिक, भक्ति, मंत्र, ध्यान, भजन, आरती, पूजा, मंदिर",
        tags: tagsMatch ? tagsMatch[1] : "आध्यात्मिक, भक्ति, मंत्र, ध्यान, भजन",
        shortDescription: shortDescMatch ? shortDescMatch[1] : cleanContent.substring(0, 150),
        moral: moralMatch ? moralMatch[1] : "जीवन में सत्य और धर्म का पालन करना चाहिए",
      };
    }
    
    // Ensure tags are properly formatted
    let tags = parsed.tags || "";
    tags = tags.replace(/,\s+/g, ',');
    tags = tags.toLowerCase();
    
    return NextResponse.json({
      success: true,
      metatitle: parsed.metatitle?.substring(0, 60) || cleanContent.substring(0, 55),
      metadesc: parsed.metadesc?.substring(0, 160) || cleanContent.substring(0, 155),
      metakeywords: parsed.metakeywords || "आध्यात्मिक, भक्ति, मंत्र, ध्यान, भजन, आरती, पूजा, मंदिर",
      tags: tags || "आध्यात्मिक, भक्ति, मंत्र, ध्यान, भजन",
      shortDescription: parsed.shortDescription || cleanContent.substring(0, 150),
      moral: parsed.moral || "जीवन में सत्य और धर्म का पालन करना चाहिए",
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}