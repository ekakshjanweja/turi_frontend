export const getMessageBadgeColor = (type: string) => {
  switch (type) {
    case "USER_INPUT":
      return "bg-primary/10 text-primary border-primary/20";
    case "AI_RESPONSE":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    case "SYSTEM":
      return "bg-chart-4/10 text-chart-4 border-chart-4/20";
    default:
      return "bg-muted/50 text-muted-foreground border-border";
  }
};

export const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatContent = (content: string | object) => {
  if (typeof content === "string") {
    return content;
  }
  return JSON.stringify(content, null, 2);
};
