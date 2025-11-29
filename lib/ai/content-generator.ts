import { GoogleGenerativeAI } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

function getGemini() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  }
  return genAI
}

export interface GenerateContentParams {
  type: 'blog' | 'social' | 'ad' | 'email' | 'product'
  topic: string
  keywords?: string[]
  tone?: string
  targetAudience?: string
  length?: 'short' | 'medium' | 'long'
  platform?: 'twitter' | 'facebook' | 'linkedin' | 'instagram'
  additionalContext?: string
}

export interface ContentGenerationResult {
  content: string
  title?: string
  metaTitle?: string
  metaDescription?: string
  seoScore?: number
}

const toneInstructions: Record<string, string> = {
  professional: 'Use a professional, authoritative tone with industry-specific terminology.',
  casual: 'Use a casual, conversational tone as if talking to a friend.',
  friendly: 'Use a warm, approachable, and friendly tone.',
  persuasive: 'Use a persuasive, compelling tone to drive action.',
  informative: 'Use an informative, educational tone focused on teaching.',
  humorous: 'Use a light, humorous tone while staying on topic.',
}

const lengthGuides: Record<string, string> = {
  short: '100-200 words',
  medium: '300-500 words',
  long: '800-1200 words',
}

function buildPrompt(params: GenerateContentParams): string {
  const { type, topic, keywords, tone, targetAudience, length, platform, additionalContext } = params

  let prompt = ''

  switch (type) {
    case 'blog':
      prompt = `Write a comprehensive blog post about "${topic}".`
      if (length) prompt += ` The blog should be ${lengthGuides[length]}.`
      if (keywords?.length) prompt += ` Include these keywords naturally: ${keywords.join(', ')}.`
      if (targetAudience) prompt += ` Target audience: ${targetAudience}.`
      prompt += ' Include an engaging title, introduction, main body with headers, and conclusion.'
      prompt += ' Also provide a meta title (60 chars) and meta description (155 chars) for SEO.'
      break

    case 'social':
      const platformLimits: Record<string, string> = {
        twitter: '280 characters',
        facebook: '500 characters',
        linkedin: '700 characters with professional tone',
        instagram: '300 characters with hashtags',
      }
      
      const limit = platform ? platformLimits[platform] : '280 characters'
      prompt = `Write an engaging ${platform || 'social media'} post about "${topic}".`
      prompt += ` Keep it under ${limit}.`
      if (keywords?.length) prompt += ` Include: ${keywords.join(', ')}.`
      if (platform === 'instagram' || platform === 'twitter') {
        prompt += ' Include relevant hashtags.'
      }
      prompt += ' Make it attention-grabbing and shareable.'
      break

    case 'ad':
      prompt = `Write compelling ad copy for "${topic}".`
      prompt += ' Include a catchy headline, engaging body copy, and a strong call-to-action.'
      if (targetAudience) prompt += ` Target audience: ${targetAudience}.`
      if (keywords?.length) prompt += ` Key benefits to highlight: ${keywords.join(', ')}.`
      prompt += ' Focus on benefits and urgency. Keep headline under 30 characters, body under 90 characters.'
      break

    case 'email':
      prompt = `Write a professional email campaign about "${topic}".`
      prompt += ' Include a compelling subject line (under 50 characters), preview text, email body, and clear CTA.'
      if (targetAudience) prompt += ` Target audience: ${targetAudience}.`
      if (length) prompt += ` Email body should be ${lengthGuides[length]}.`
      prompt += ' Use personalization placeholders like [First Name].'
      break

    case 'product':
      prompt = `Write a compelling product description for "${topic}".`
      prompt += ' Include key features, benefits, specifications, and why customers should buy.'
      if (keywords?.length) prompt += ` Highlight: ${keywords.join(', ')}.`
      if (targetAudience) prompt += ` Target audience: ${targetAudience}.`
      prompt += ' Make it scannable with bullet points for features.'
      break
  }

  if (tone && toneInstructions[tone]) {
    prompt += ` ${toneInstructions[tone]}`
  }

  if (additionalContext) {
    prompt += ` Additional context: ${additionalContext}`
  }

  return prompt
}

export async function generateContent(params: GenerateContentParams): Promise<ContentGenerationResult> {
  try {
    const genAI = getGemini()
    
    if (!genAI) {
      throw new Error('Gemini API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = buildPrompt(params)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text()

    // Parse structured content based on type
    if (params.type === 'blog') {
      const sections = generatedText.split('\n\n')
      const title = sections[0]?.replace(/^#+\s*/, '').replace(/^Title:\s*/i, '')
      
      // Extract meta tags if present
      const metaTitleMatch = generatedText.match(/Meta Title:?\s*(.+)/i)
      const metaDescMatch = generatedText.match(/Meta Description:?\s*(.+)/i)
      
      return {
        content: generatedText,
        title: title || params.topic,
        metaTitle: metaTitleMatch?.[1]?.trim() || title?.substring(0, 60),
        metaDescription: metaDescMatch?.[1]?.trim(),
        seoScore: calculateSEOScore(generatedText, params.keywords || []),
      }
    }

    if (params.type === 'email') {
      const subjectMatch = generatedText.match(/Subject(?:\s*Line)?:?\s*(.+)/i)
      const title = subjectMatch?.[1]?.trim() || 'Email Campaign'
      
      return {
        content: generatedText,
        title,
      }
    }

    if (params.type === 'ad') {
      const headlineMatch = generatedText.match(/Headline:?\s*(.+)/i)
      const title = headlineMatch?.[1]?.trim() || params.topic
      
      return {
        content: generatedText,
        title,
      }
    }

    return {
      content: generatedText,
      title: params.topic,
    }
  } catch (error) {
    console.error('Error generating content:', error)
    throw new Error('Failed to generate content. Please try again.')
  }
}

function calculateSEOScore(content: string, keywords: string[]): number {
  let score = 50 // Base score

  const wordCount = content.split(/\s+/).length
  
  // Length score
  if (wordCount >= 300) score += 10
  if (wordCount >= 800) score += 10

  // Keyword presence
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi')
    const matches = content.match(regex)
    if (matches) {
      score += Math.min(matches.length * 5, 15) // Max 15 points per keyword
    }
  })

  // Headers presence
  if (content.match(/^#+\s/m)) score += 10

  return Math.min(score, 100)
}

export async function rephraseContent(content: string, newTone?: string): Promise<string> {
  try {
    const genAI = getGemini()
    if (!genAI) throw new Error('Gemini API key not configured')

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const toneInstruction = newTone && toneInstructions[newTone] 
      ? toneInstructions[newTone] 
      : 'Maintain a similar tone.'

    const prompt = `You are an expert editor. Rephrase the following content while maintaining its core message. ${toneInstruction}\n\nContent:\n${content}`
    const result = await model.generateContent(prompt)
    const response = await result.response

    return response.text() || content
  } catch (error) {
    console.error('Error rephrasing content:', error)
    throw new Error('Failed to rephrase content.')
  }
}

export async function summarizeContent(content: string, maxLength: number = 150): Promise<string> {
  try {
    const genAI = getGemini()
    if (!genAI) throw new Error('Gemini API key not configured')

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `You are an expert at creating concise summaries. Summarize the following content in ${maxLength} words or less:\n\n${content}`
    const result = await model.generateContent(prompt)
    const response = await result.response

    return response.text() || ''
  } catch (error) {
    console.error('Error summarizing content:', error)
    throw new Error('Failed to summarize content.')
  }
}

export async function generateKeywordSuggestions(topic: string, count: number = 10): Promise<string[]> {
  try {
    const genAI = getGemini()
    if (!genAI) throw new Error('Gemini API key not configured')

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `You are an SEO expert. Suggest ${count} relevant SEO keywords for the topic: "${topic}". Return only the keywords, one per line.`
    const result = await model.generateContent(prompt)
    const response = await result.response

    const keywords = response.text()
      ?.split('\n')
      .map((k: string) => k.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter((k: string) => k.length > 0) || []

    return keywords.slice(0, count)
  } catch (error) {
    console.error('Error generating keywords:', error)
    throw new Error('Failed to generate keyword suggestions.')
  }
}

export async function generateContentIdeas(
  industry: string,
  targetAudience: string,
  count: number = 5
): Promise<string[]> {
  try {
    const genAI = getGemini()
    if (!genAI) throw new Error('Gemini API key not configured')

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `You are a creative content strategist. Generate ${count} engaging content ideas for the ${industry} industry targeting ${targetAudience}. Return only the ideas, one per line.`
    const result = await model.generateContent(prompt)
    const response = await result.response

    const ideas = response.text()
      ?.split('\n')
      .map((i: string) => i.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter((i: string) => i.length > 0) || []

    return ideas.slice(0, count)
  } catch (error) {
    console.error('Error generating content ideas:', error)
    throw new Error('Failed to generate content ideas.')
  }
}
