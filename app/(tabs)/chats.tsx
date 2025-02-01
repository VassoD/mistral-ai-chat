import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { getChats, createChat } from "../../services/supabase";
import { ChatList } from "../../components/ChatList";
import type { Database } from "../../types/supabase";
import { router } from "expo-router";

type Chat = Database["public"]["Tables"]["chats"]["Row"];

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([]);

  const handleNewChat = useCallback(async () => {
    const newChat = await createChat();
    if (newChat) {
      router.push({
        pathname: "/chat",
        params: { id: newChat.id },
      });
    }
  }, []);

  useEffect(() => {
    getChats().then(setChats);
  }, []);

  return (
    <View style={styles.container}>
      <ChatList chats={chats} onNewChat={handleNewChat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
