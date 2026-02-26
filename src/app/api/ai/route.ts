import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT_TEMPLATE } from '@/lib/ai/prompts';
import { getLessonContext } from '@/lib/ai/rag';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages, lessonId } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
  }

  // Basic rate limiting (placeholder logic, normally use Redis/KV)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('ai_conversations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', oneHourAgo);

  if (count !== null && count >= 20) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
  }

  let systemPrompt = SYSTEM_PROMPT_TEMPLATE;

  if (lessonId) {
    const context = await getLessonContext(lessonId);
    if (context) {
      systemPrompt = systemPrompt
        .replace('{{course_title}}', context.courseTitle)
        .replace('{{module_title}}', context.moduleTitle)
        .replace('{{lesson_title}}', context.lessonTitle)
        .replace('{{lesson_content}}', context.lessonContent);
    }
  }

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m: any) => ({ role: m.role, content: m.content }))
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: apiMessages as any,
      stream: true,
    });

    // Save conversation to DB (just the user's latest message for now)
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      await supabase.from('ai_conversations').insert({
        user_id: user.id,
        lesson_id: lessonId || null,
        prompt: lastUserMessage.content,
        response: '', // Will update later if needed, or just store prompts
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
