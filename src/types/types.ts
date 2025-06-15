// Shared types for WebSocket communication between frontend and backend

export type MessageType =
  | "USER_INPUT"
  | "AI_RESPONSE"
  | "SYSTEM";

export type WebSocketMessage = {
  type: MessageType;
  content: string | object;
  timestamp?: string; // ISO string timestamp
};

// Specific message types for better type safety
export type UserInputMessage = WebSocketMessage & {
  type: "USER_INPUT";
  content: string;
};

export type AIResponseMessage = WebSocketMessage & {
  type: "AI_RESPONSE";
  content: string;
};

export type SystemMessage = WebSocketMessage & {
  type: "SYSTEM";
  content: string;
};

// Frontend-specific message type (extends WebSocketMessage with frontend-only properties)
export type Message = Omit<WebSocketMessage, "timestamp"> & {
  id: string;
  timestamp: Date;
};

// Email-specific types
export type EmailSummary = {
  id: string;
  subject: string;
  from: string;
  date: string;
};

export type EmailDetail = {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  textContent?: string;
  htmlContent?: string;
  attachments: Array<{
    id: string;
    filename: string;
    mimeType: string;
    size: number;
  }>;
};

export type EmailSearchResult = {
  emails: EmailSummary[];
  query: string;
  totalCount: number;
};

export type EmailReadResult = {
  email: EmailDetail;
  messageId: string;
};

// Gmail Label types
export type GmailLabel = {
  id: string;
  name: string;
  type?: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
  messagesTotal?: number;
  messagesUnread?: number;
  color?: {
    textColor?: string;
    backgroundColor?: string;
  };
};

export type LabelManagerResult = {
  success: boolean;
  message: string;
  label?: GmailLabel;
  labels?: {
    all: GmailLabel[];
    system: GmailLabel[];
    user: GmailLabel[];
    count: {
      total: number;
      system: number;
      user: number;
    };
  };
};
