import { NextRequest, NextResponse } from 'next/server'
import { knowledge } from '@/data/knowledge'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const lastMessage = messages[messages.length - 1]?.content || ""

    // âœ… Ø±Ø¨Ø· customQA
    const custom = knowledge.customQA.find((item: any) =>
      lastMessage.includes(item.question)
    )

    if (custom) {
      return NextResponse.json({
        content: custom.answer
      })
    }

    const systemPrompt = `
Ø£Ù†Øª Ù…Ø³Ø§Ø¹Ø¯ Ø°ÙƒÙŠ Ù„Ù…Ù†ØµØ© ${knowledge.platform.name}.

Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„Ù…Ù†ØµØ©:
${knowledge.platform.description}

Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª:
${knowledge.features.join('\n')}

Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø¹Ù† Ø§Ù„Ø¨ÙˆØª:
${knowledge.chatbot.description}

Ù‚Ø¯Ø±Ø§ØªÙƒ:
${knowledge.chatbot.abilities.join('\n')}

ØµØ§Ø­Ø¨ Ø§Ù„Ù…Ù†ØµØ©:
${knowledge.owner.name} - ${knowledge.owner.role}

Ø£Ø¬Ø¨ Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø³ØªØ®Ø¯Ù… Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø¹Ù†Ø¯Ù…Ø§ ÙŠØ³Ø£Ù„ Ø¹Ù†Ù‡Ø§.
`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        content: "Ø®Ø·Ø£: " + JSON.stringify(data)
      })
    }

    return NextResponse.json({
      content: data.choices?.[0]?.message?.content || 'Ù„Ù… ÙŠØªÙ… ØªÙˆÙ„ÙŠØ¯ Ø±Ø¯'
    })

  } catch (error) {
    return NextResponse.json({
      content: 'Ø®Ø·Ø£ ÙÙŠ Ø§Ù„Ø³ÙŠØ±ÙØ±'
    })
  }
}

