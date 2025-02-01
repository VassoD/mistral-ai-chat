import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import Constants from "expo-constants";

const SUPABASE_URL =
  Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase configuration. Please check your .env file.");
}

// Simplified client without auth
export const supabase = createClient<Database>(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!
);

// Helper functions to check database contents
export async function listTables() {
  console.log("Attempting to connect to Supabase...");
  try {
    const { data, error } = await supabase
      .from("messages") // or any table you know exists in your database
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }
    console.log("Connection successful, data:", data);
    return data;
  } catch (e) {
    console.error("Connection error:", e);
    return [];
  }
}

export async function getTableContents(tableName: string) {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    console.error(`Error fetching ${tableName} contents:`, error);
    return [];
  }
  return data;
}

export function subscribeToMessages(
  callback: (message: Database["public"]["Tables"]["messages"]["Row"]) => void
) {
  return supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        callback(
          payload.new as Database["public"]["Tables"]["messages"]["Row"]
        );
      }
    )
    .subscribe();
}

export async function createChat(title: string = "New Chat") {
  const { data, error } = await supabase
    .from("chats")
    .insert([{ title }])
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function getChats() {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getMessages(chatId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return data;
}

export function subscribeToChat(
  chatId: string,
  callback: (message: Database["public"]["Tables"]["messages"]["Row"]) => void
) {
  return supabase
    .channel(`chat:${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      (payload) => {
        callback(
          payload.new as Database["public"]["Tables"]["messages"]["Row"]
        );
      }
    )
    .subscribe();
}

export async function deleteChat(chatId: string) {
  const { error } = await supabase.from("chats").delete().eq("id", chatId);

  return !error;
}
