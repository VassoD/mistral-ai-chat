export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          last_message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title?: string;
          last_message?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          last_message?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          content: string;
          role: string;
          response: string | null;
          chat_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          content: string;
          role: string;
          response?: string | null;
          chat_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          content?: string;
          role?: string;
          response?: string | null;
          chat_id?: string;
        };
      };
    };
  };
}
