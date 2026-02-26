export async function streamAIResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  lessonId?: string,
  onChunk?: (chunk: string) => void
) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, lessonId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch AI response');
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;
      if (onChunk) onChunk(chunk);
    }
  }

  return fullResponse;
}
