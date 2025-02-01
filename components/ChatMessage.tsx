import React, { memo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { formatDate } from "../utils/dateUtils";
import type { Database } from "../types/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = memo(({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View style={styles.messageContent}>
        <Text style={[styles.sender, isUser && styles.userSender]}>
          {isUser ? "You" : "Mistral"}
        </Text>
        <Text
          style={[styles.messageText, isUser && styles.userText]}
          selectable={true}
        >
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser && styles.userTimestamp]}>
          {formatDate(message.created_at)}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "85%",
    marginVertical: 8,
    borderRadius: 20,
  },
  messageContent: {
    padding: 12,
  },
  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#18181B",
  },
  aiContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#0D0D0D",
    borderWidth: 1,
    borderColor: "#18181B",
  },
  sender: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#A8A29D",
  },
  userSender: {
    color: "#FFA300",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#A8A29D",
  },
  userText: {
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 11,
    color: "#A8A29D",
    marginTop: 6,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "#A8A29D",
  },
});
