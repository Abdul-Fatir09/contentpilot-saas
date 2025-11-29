import OpenAI from 'openai'

let openai: OpenAI | null = null

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
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
    const client = getOpenAI()
    
    if (!client) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = buildPrompt(params)

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content marketer and copywriter. Create high-quality, engaging content optimized for the specified format and audience.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: params.type === 'blog' && params.length === 'long' ? 2000 : 1000,
    })

    const generatedText = completion.choices[0]?.message?.content || ''

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
    const client = getOpenAI()
    if (!client) throw new Error('OpenAI API key not configured')

    const toneInstruction = newTone && toneInstructions[newTone] 
      ? toneInstructions[newTone] 
      : 'Maintain a similar tone.'

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert editor. Rephrase the given content while maintaining its core message.',
        },
        {
          role: 'user',
          content: `Rephrase the following content. ${toneInstruction}\n\nContent:\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    return completion.choices[0]?.message?.content || content
  } catch (error) {
    console.error('Error rephrasing content:', error)
    throw new Error('Failed to rephrase content.')
  }
}

export async function summarizeContent(content: string, maxLength: number = 150): Promise<string> {
  try {
    const client = getOpenAI()
    if (!client) throw new Error('OpenAI API key not configured')

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating concise summaries.',
        },
        {
          role: 'user',
          content: `Summarize the following content in ${maxLength} words or less:\n\n${content}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 300,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error summarizing content:', error)
    throw new Error('Failed to summarize content.')
  }
}

export async function generateKeywordSuggestions(topic: string, count: number = 10): Promise<string[]> {
  try {
    const client = getOpenAI()
    if (!client) throw new Error('OpenAI API key not configured')

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert. Suggest relevant keywords for content optimization.',
        },
        {
          role: 'user',
          content: `Suggest ${count} relevant SEO keywords for the topic: "${topic}". Return only the keywords, one per line.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 200,
    })

    const keywords = completion.choices[0]?.message?.content
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
    const client = getOpenAI()
    if (!client) throw new Error('OpenAI API key not configured')

    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a creative content strategist. Generate engaging content ideas.',
        },
        {
          role: 'user',
          content: `Generate ${count} engaging content ideas for the ${industry} industry targeting ${targetAudience}. Return only the ideas, one per line.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    })

    const ideas = completion.choices[0]?.message?.content
      ?.split('\n')
      .map((i: string) => i.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter((i: string) => i.length > 0) || []

    return ideas.slice(0, count)
  } catch (error) {
    console.error('Error generating content ideas:', error)
    throw new Error('Failed to generate content ideas.')
  }
}
