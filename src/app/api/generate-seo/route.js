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

// ─── LANGUAGE DETECTION ───
function detectLanguage(text) {
  if (!text) return 'en';
  // Check for Devanagari script (Hindi)
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return 'hi';
  }
  return 'en'; // Default to English
}

// ─── GENERATE PROMPT BASED ON LANGUAGE ───
function generatePrompt(content, language) {
  const isHindi = language === 'hi';
  const contentSub = content.substring(0, 3000);

  if (isHindi) {
    return `You are an SEO expert for spiritual/religious content. Analyze the following story content and generate SEO metadata in Hindi.

Story Content: ${contentSub}

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
  }

  // English prompt
  return `You are an SEO expert for spiritual/religious content. Analyze the following story content and generate SEO metadata in English.

Story Content: ${contentSub}

Generate a JSON response with these exact fields (no extra text, no markdown):

{
  "metatitle": "50-60 character SEO title in English",
  "metadesc": "150-160 character SEO description in English",
  "metakeywords": "8-10 comma-separated keywords in English",
  "tags": "5-6 comma-separated lowercase tags in English (use hyphens for multi-word tags)",
  "shortDescription": "A 2-3 sentence summary in English (max 200 characters)",
  "moral": "The moral or lesson of the story in English (max 150 characters)"
}

Important Rules:
- metatitle: 50-60 chars exactly, must be in English, include main keyword
- metadesc: 150-160 chars exactly, must be in English
- metakeywords: Exactly 8-10 English keywords separated by commas
- tags: Exactly 5-6 lowercase English tags separated by commas, use hyphens for multi-word tags
- shortDescription: 2-3 sentences in English, max 200 characters
- moral: The main lesson from the story in English, max 150 characters

Return ONLY valid JSON, no markdown, no extra text.`;
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
    
    // ─── DETECT LANGUAGE ───
    const language = detectLanguage(cleanContent);
    const isHindi = language === 'hi';
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // ─── GENERATE LANGUAGE-SPECIFIC PROMPT ───
    const prompt = generatePrompt(cleanContent, language);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean the response
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // ─── FALLBACK VALUES BASED ON LANGUAGE ───
    const fallbackTitle = isHindi ? cleanContent.substring(0, 55) : cleanContent.substring(0, 55);
    const fallbackDesc = isHindi ? cleanContent.substring(0, 155) : cleanContent.substring(0, 155);
    const fallbackKeywords = isHindi 
      ? "आध्यात्मिक, भक्ति, मंत्र, ध्यान, भजन, आरती, पूजा, मंदिर" 
      : "spiritual, devotion, mantra, meditation, bhajan, aarti, worship, temple";
    const fallbackTags = isHindi 
      ? "आध्यात्मिक, भक्ति, मंत्र, ध्यान, भजन" 
      : "spiritual, devotion, mantra, meditation, bhajan";
    const fallbackShort = isHindi ? cleanContent.substring(0, 150) : cleanContent.substring(0, 150);
    const fallbackMoral = isHindi 
      ? "जीवन में सत्य और धर्म का पालन करना चाहिए" 
      : "One should follow truth and righteousness in life";
    
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
        metatitle: titleMatch ? titleMatch[1] : fallbackTitle,
        metadesc: descMatch ? descMatch[1] : fallbackDesc,
        metakeywords: keywordsMatch ? keywordsMatch[1] : fallbackKeywords,
        tags: tagsMatch ? tagsMatch[1] : fallbackTags,
        shortDescription: shortDescMatch ? shortDescMatch[1] : fallbackShort,
        moral: moralMatch ? moralMatch[1] : fallbackMoral,
      };
    }
    
    // Ensure tags are properly formatted
    let tags = parsed.tags || "";
    tags = tags.replace(/,\s+/g, ',');
    tags = tags.toLowerCase();
    
    return NextResponse.json({
      success: true,
      metatitle: parsed.metatitle?.substring(0, 60) || fallbackTitle,
      metadesc: parsed.metadesc?.substring(0, 160) || fallbackDesc,
      metakeywords: parsed.metakeywords || fallbackKeywords,
      tags: tags || fallbackTags,
      shortDescription: parsed.shortDescription || fallbackShort,
      moral: parsed.moral || fallbackMoral,
    });
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}