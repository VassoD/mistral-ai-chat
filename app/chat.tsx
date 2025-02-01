import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
  Modal,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  supabase,
  getMessages,
  getChats,
  createChat,
  deleteChat,
} from "../services/supabase";
import { generateMistralResponse } from "../services/mistral";
import { ChatMessage } from "../components/ChatMessage";
import type { Database } from "../types/supabase";
import { ChatList } from "../components/ChatList";
import { MistralLogo } from "../components/ui/MistralLogo";
import { LayoutSidebarIcon } from "../components/ui/LayoutSidebarIcon";

type Message = Database["public"]["Tables"]["messages"]["Row"];
type Chat = Database["public"]["Tables"]["chats"]["Row"];

// Memoize individual chat messages
const MemoizedChatMessage = memo(ChatMessage);

export default function Chat() {
  const { id: chatId } = useLocalSearchParams<{ id: string }>();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const inputRef = useRef<TextInput>(null);
  const [showChatList, setShowChatList] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleNewMessage = useCallback(
    (message: Message) => {
      if (Platform.OS !== "web" || isHydrated) {
        setMessages((currentMessages) => {
          const exists = currentMessages.some((msg) => msg.id === message.id);
          if (exists) return currentMessages;

          const newMessages = [...currentMessages, message];
          return newMessages.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        });
      }
    },
    [isHydrated]
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !chatId) return;

    setIsLoading(true);
    const userInput = input.trim();
    setInput("");
    inputRef.current?.blur();

    try {
      const { data: userMessage, error: insertError } = await supabase
        .from("messages")
        .insert([
          {
            content: userInput,
            role: "user",
            response: null,
            chat_id: chatId,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      handleNewMessage(userMessage);

      const aiResponse = await generateMistralResponse(userInput);
      const { data: aiMessage, error: aiError } = await supabase
        .from("messages")
        .insert([
          {
            content: aiResponse,
            role: "assistant",
            response: null,
            chat_id: chatId,
          },
        ])
        .select()
        .single();

      if (aiError) throw aiError;
      handleNewMessage(aiMessage);
    } catch (error) {
      alert("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [input, handleNewMessage, chatId]);

  const renderMessage: ListRenderItem<Message> = useCallback(
    ({ item }) => <MemoizedChatMessage message={item} />,
    []
  );

  useEffect(() => {
    let mounted = true;

    if (Platform.OS !== "web" || isHydrated) {
      if (chatId) {
        getMessages(chatId).then((initialMessages) => {
          if (!mounted) return;
          setMessages(initialMessages || []);
          scrollToBottom();
        });
      }
    }

    const subscription = supabase
      .channel(`messages:${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (mounted && payload.new && (Platform.OS !== "web" || isHydrated)) {
            handleNewMessage(payload.new as Message);
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isHydrated, handleNewMessage, scrollToBottom, chatId]);

  // Add function to create new chat
  const handleNewChat = useCallback(async () => {
    const newChat = await createChat();
    if (newChat) {
      router.push({
        pathname: "/chat",
        params: { id: newChat.id },
      });
    }
  }, []);

  // Load chats
  useEffect(() => {
    getChats().then(setChats);
  }, []);

  const showChatListWithAnimation = () => {
    setShowChatList(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const hideChatListWithAnimation = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowChatList(false));
  };

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      const success = await deleteChat(chatId);
      if (success) {
        setChats((current) => current.filter((chat) => chat.id !== chatId));
        if (chatId === chatId) {
          router.replace("/chat");
        }
      }
    },
    [chatId]
  );

  const handleRefresh = useCallback(async () => {
    if (!chatId) return;
    setIsRefreshing(true);
    try {
      const refreshedMessages = await getMessages(chatId);
      setMessages(refreshedMessages || []);
    } catch (error) {
      console.error("Error refreshing messages:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [chatId]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "LE CHAT NOIR_",
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "800",
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{ paddingRight: 16 }}
              onPress={
                showChatList
                  ? hideChatListWithAnimation
                  : showChatListWithAnimation
              }
            >
              <LayoutSidebarIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerRight: () => <MistralLogo />,
        }}
      />

      <View style={styles.content}>
        {Platform.OS === "web" && (
          <ChatList
            chats={chats}
            onNewChat={handleNewChat}
            currentChatId={chatId}
            onDeleteChat={handleDeleteChat}
          />
        )}
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={scrollToBottom}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#A8A29D"
              multiline
              maxLength={500}
              editable={!isLoading}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              blurOnSubmit={true}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                isLoading && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={isLoading || !input.trim()}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {Platform.OS !== "web" && showChatList && (
        <Modal
          visible={showChatList}
          transparent={true}
          onRequestClose={hideChatListWithAnimation}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={hideChatListWithAnimation}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={hideChatListWithAnimation}
                style={styles.menuHeaderButton}
              >
                <LayoutSidebarIcon size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <ChatList
                chats={chats}
                onNewChat={handleNewChat}
                currentChatId={chatId}
                onSelectChat={hideChatListWithAnimation}
                onDeleteChat={handleDeleteChat}
              />
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 30,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#18181B",
    borderTopWidth: 1,
    borderTopColor: "#18181B",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#18181B",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 120,
    fontSize: 15,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A8A29D",
  },
  sendButton: {
    backgroundColor: "#FE4901",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(13, 13, 13, 0.5)",
  },
  modalContent: {
    width: Math.min(300, Dimensions.get("window").width * 0.8),
    backgroundColor: "#18181B",
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#18181B",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuHeaderButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#18181B",
  },
});
