import OpenAI from 'openai';
import { Conversation, ConversationMessageRole } from 'src/mongoose/schemas/converstation.schema';
import { Sentence } from 'src/notion/notion.type';

export const searchNotionByQuestionPromptFactory = (
  question: string,
  sentences: Sentence[],
  messages?: Conversation['messages'],
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] => {
  console.log('question', question);
  console.log('sentences', sentences);
  console.log('messages', messages);

  const systemPrompt = `You are a helpful and knowledgeable assistant for Notion Search Agent documentation.

  **Core principles:**
  - Be natural and conversational while being accurate and helpful
  - Use the provided search results as your primary information source
  - Apply logical reasoning and connect concepts to provide comprehensive answers
  - Maintain context from previous conversations when available

  **How to use search results:**
  - Search results contain the most relevant information for the user's question
  - Use this information as the foundation for your response
  - You can make logical inferences and connections based on the provided information
  - If search results don't contain enough information to fully answer the question, acknowledge this honestly

  **Conversation context:**
  - Previous conversation history is provided when available
  - Use this context to provide more natural and contextual responses  
  - Reference previous discussions when relevant to build on the conversation
  - Maintain conversation flow naturally

  **Response approach:**
  - Answer in the same language as the user's question
  - Provide direct, helpful answers based on available information
  - When search results are limited, you can still provide general guidance or ask clarifying questions
  - Be conversational but avoid making up specific details not found in the search results
  - If the question is completely unrelated to Notion Search Agent and no relevant search results exist, politely redirect to Notion Search Agent topics

  **Response style:**
  - Natural, friendly, and helpful tone
  - Provide context and explanations when helpful
  - Connect information logically to give comprehensive answers
  - End with an offer to help further when appropriate
  `;

  let previousMessagesPrompt = `Previous conversation history:`;

  const prompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
  ];

  if (messages) {
    for (const message of messages) {
      switch (message.role) {
        case ConversationMessageRole.USER:
          previousMessagesPrompt += `\nUser: ${message.content}`;
          break;
        case ConversationMessageRole.ASSISTANT:
          previousMessagesPrompt += `\nAssistant: ${message.content}`;
          break;
      }
    }
  }

  sentences.forEach((sentence) => {
    prompt.push({
      role: 'system',
      content: [
        `Block ID: ${sentence.blockId}`,
        `Value: ${sentence.value}`,
        `Type: ${sentence.type}`,
        `Language: ${sentence.language}`,
      ].join('\n'),
    });
  });

  if (previousMessagesPrompt) {
    prompt.push({
      role: 'system',
      content: previousMessagesPrompt,
    });
  }

  prompt.push({
    role: 'user',
    content: `Question: ${question}`,
  });

  return prompt;
};

export const SUMMARY_PROMPT = `You are a helpful assistant that creates concise conversation summaries.

Requirements:
- Create a single-line summary (maximum 50 characters)
- Use the same language as the user's input
- Focus on the main topic or question asked
- Remove all markdown formatting
- Be direct and clear
- Examples:
  - User asks "React에서 useState 사용법" → "React useState 사용법"
  - User asks "How to fix build errors?" → "Build error troubleshooting"
  - User asks "データベース設計について" → "データベース設計相談"

Respond with ONLY the summary text, no additional formatting or explanations.`;
