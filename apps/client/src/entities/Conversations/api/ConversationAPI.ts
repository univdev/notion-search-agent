import axiosInstance from '@/shared/api/AxiosInstance';
import API_ROUTES from '@/shared/routes/APIRoutes';

export type Conversation = {
  _id: string;
  summary: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
};

type ConversationMessage = {
  role: (typeof ConversationMessageSender)[keyof typeof ConversationMessageSender];
  content: string;
};

type GetConversationResponse = {
  data: Conversation;
};

export const ConversationMessageSender = {
  USER: 'user',
  ASSISTANT: 'assistant',
} as const;

export const getConversation = (conversationId: string) => {
  return axiosInstance<GetConversationResponse>(API_ROUTES.CONVERSATIONS.GET_DETAIL(conversationId));
};

export const sendConversationMessageStream = (question: string, conversationId?: string) => {
  const baseURL = import.meta.env.VITE_API_URL;
  const url = [`${baseURL}${API_ROUTES.CONVERSATIONS.QUESTION}`, conversationId].filter(Boolean).join('/');

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
    }),
  });
};
