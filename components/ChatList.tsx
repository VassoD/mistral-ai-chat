import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import type { Database } from "../types/supabase";
import { Ionicons } from "@expo/vector-icons";

type Chat = Database["public"]["Tables"]["chats"]["Row"];

interface ChatListProps {
  chats: Chat[];
  onNewChat: () => void;
  currentChatId?: string;
  onSelectChat?: () => void;
  onDeleteChat?: (chatId: string) => void;
}

export function ChatList({
  chats,
  onNewChat,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: ChatListProps) {
  console.log(
    "Available chats:",
    chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      created_at: chat.created_at,
    }))
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newChatButton} onPress={onNewChat}>
        <Text style={styles.newChatText}>+ New Chat</Text>
      </TouchableOpacity>

      {chats.map((chat) => (
        <View key={chat.id} style={styles.chatItemWrapper}>
          <Link
            href={{
              pathname: "/chat",
              params: { id: chat.id },
            }}
            asChild
          >
            <TouchableOpacity
              style={{
                ...styles.chatItem,
                ...(chat.id === currentChatId ? styles.activeChatItem : {}),
              }}
              onPress={onSelectChat}
            >
              <Text style={styles.chatId}>{chat.id}</Text>
              <Text
                style={{
                  ...styles.chatTitle,
                  ...(chat.id === currentChatId ? styles.activeChatTitle : {}),
                }}
                numberOfLines={1}
              >
                {chat.title}
              </Text>
              {chat.last_message && (
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {chat.last_message}
                </Text>
              )}
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteChat?.(chat.id)}
          >
            <Ionicons name="trash-bin-outline" size={18} color="#FF0008" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    backgroundColor: "#18181B",
    borderRightWidth: 1,
    borderRightColor: "#18181B",
  },
  newChatButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
  },
  chatItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
  },
  chatItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
  },
  activeChatItem: {
    backgroundColor: "#0D0D0D",
  },
  chatTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  activeChatTitle: {
    color: "#FF7002",
  },
  lastMessage: {
    color: "#A8A29D",
    fontSize: 12,
    marginTop: 4,
  },
  chatId: {
    color: "#A8A29D",
    fontSize: 10,
    marginBottom: 4,
  },
  newChatText: {
    color: "#FFA300",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 12,
    marginLeft: "auto",
  },
});
