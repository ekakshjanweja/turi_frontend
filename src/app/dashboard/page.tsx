"use client";

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Unauthorized } from "@/components/unauthorized";
import { auth } from "@/lib/auth";
import {
  ArrowUp,
  Square,
  Bot,
  Clock,
  Mail,
  Send,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MessageType = {
  id: string;
  type: "USER_INPUT" | "AI_RESPONSE" | "SYSTEM";
  content: string;
  timestamp: Date;
};

type WebSocketMessage = {
  type: "USER_INPUT" | "AI_RESPONSE" | "SYSTEM";
  content: string;
  timestamp: string;
};

const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getMessageBadgeColor = (type: MessageType["type"]): string => {
  switch (type) {
    case "USER_INPUT":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "AI_RESPONSE":
      return "bg-green-50 text-green-700 border-green-200";
    case "SYSTEM":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function Dashboard() {
  const { data: session, isPending } = auth.useSession();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined" || !session?.user) return;

    const backendUrl = process.env.NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_AUTH_BASE_URL
      : "http://localhost:8000";
    
    if (!backendUrl) {
      console.error("Backend URL is not configured");
      return;
    }
    
    const wsUrl = backendUrl.replace(/^https?:/, backendUrl.startsWith("https") ? "wss:" : "ws:") + "/ws";

    const ws = new WebSocket(wsUrl);

    const addMessage = (type: MessageType["type"], content: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          type,
          content,
          timestamp: new Date(),
        },
      ]);
    };

    const handleMessage = (event: MessageEvent) => {
      console.log("Message from server:", event.data);
      setIsLoading(false);

      try {
        const parsedMessage: WebSocketMessage = JSON.parse(event.data);

        const content =
          typeof parsedMessage.content === "string"
            ? parsedMessage.content
            : JSON.stringify(parsedMessage.content, null, 2);

        // Skip USER_INPUT messages to avoid duplicates (handled optimistically)
        if (parsedMessage.type !== "USER_INPUT") {
          addMessage(parsedMessage.type, content);
        }
      } catch (error) {
        // Handle malformed JSON as system message
        addMessage("SYSTEM", event.data);
      }
    };

    const handleOpen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      addMessage(
        "SYSTEM",
        "Connected to Email Agent. You can now search your emails!"
      );
    };

    const handleClose = (event: CloseEvent) => {
      console.log("WebSocket disconnected:", event.reason);
      setIsConnected(false);
      setIsLoading(false);
      addMessage(
        "SYSTEM",
        `Disconnected from server. ${event.reason || "Connection lost"}`
      );
    };

    const handleError = (error: Event) => {
      console.error("WebSocket error:", error);
      setIsLoading(false);
      addMessage("SYSTEM", "Connection error occurred.");
    };

    ws.addEventListener("open", handleOpen);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("error", handleError);

    setSocket(ws);

    return () => {
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("close", handleClose);
      ws.removeEventListener("error", handleError);
      ws.close();
    };
  }, [session?.user]);

  const handleSubmit = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !input.trim()) {
      return;
    }

    // Add user message optimistically
    const userMessage: MessageType = {
      id: `${Date.now()}-${Math.random()}`,
      type: "USER_INPUT",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Send message to server
    try {
      socket.send(
        JSON.stringify({
          type: "USER_INPUT",
          content: input.trim(),
          timestamp: new Date().toISOString(),
        })
      );
      setInput(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          type: "SYSTEM",
          content: "Failed to send message. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleValueChange = (value: string) => {
    setInput(value);
  };

  if (isPending) {
    return <Loading />;
  }

  if (!session?.user) {
    return <Unauthorized />;
  }

  return (
    <>
      <div className="flex flex-col max-w-3xl mx-auto p-4 h-[90vh]">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 border rounded-lg p-4 mb-4 overflow-y-auto space-y-4">
            {messages.length === 0 && isConnected && (
              <div className="text-center py-12">
                <div className="p-3 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">
                  Hello! I'm your email assistant.
                </h3>
                <p className="text-muted-foreground mb-4">
                  Ask me anything about your emails.
                </p>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p className="font-mono bg-background px-3 py-2 rounded border text-left">
                    "Find emails from john@example.com"
                  </p>
                  <p className="font-mono bg-background px-3 py-2 rounded border text-left">
                    "Show me emails about project updates"
                  </p>
                  <p className="font-mono bg-background px-3 py-2 rounded border text-left">
                    "Find unread emails from last week"
                  </p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <Message
                key={message.id}
                className={
                  message.type === "USER_INPUT"
                    ? "justify-end"
                    : "justify-start"
                }
              >
                {message.type !== "USER_INPUT" && (
                  <MessageAvatar
                    src=""
                    alt={message.type}
                    fallback={message.type === "AI_RESPONSE" ? "AI" : "S"}
                  />
                )}

                <div className="flex flex-col max-w-[80%] space-y-1">
                  {/* Message metadata */}
                  <div className="flex items-center gap-2 px-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getMessageBadgeColor(
                        message.type
                      )}`}
                    >
                      {message.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  {/* Message content */}
                  <div className="bg-transparent">
                    <MessageContent markdown className="bg-transparent p-0">
                      {message.content as string}
                    </MessageContent>
                  </div>
                </div>
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <PromptInput
            value={input}
            onValueChange={handleValueChange}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className="w-full flex-shrink-0"
          >
            <PromptInputTextarea
              placeholder="Ask me anything..."
              className="min-h-[60px]"
            />

            <PromptInputActions className="justify-end pt-4">
              <PromptInputAction
                tooltip={isLoading ? "Stop generation" : "Send message"}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleSubmit}
                  disabled={!isConnected || !input.trim() || isLoading}
                >
                  {isLoading ? (
                    <Square className="size-5 fill-current" />
                  ) : (
                    <ArrowUp className="size-5" />
                  )}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    </>
  );
}
