export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      battle_participants: {
        Row: {
          battle_id: string
          id: string
          joined_at: string
          rank: number | null
          score: number
          total_time: number
          user_id: string
        }
        Insert: {
          battle_id: string
          id?: string
          joined_at?: string
          rank?: number | null
          score?: number
          total_time?: number
          user_id: string
        }
        Update: {
          battle_id?: string
          id?: string
          joined_at?: string
          rank?: number | null
          score?: number
          total_time?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_participants_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battles"
            referencedColumns: ["id"]
          },
        ]
      }
      battle_videos: {
        Row: {
          board: string
          class_level: string
          created_at: string
          id: string
          updated_at: string
          video_type: string
          video_url: string
        }
        Insert: {
          board: string
          class_level: string
          created_at?: string
          id?: string
          updated_at?: string
          video_type?: string
          video_url: string
        }
        Update: {
          board?: string
          class_level?: string
          created_at?: string
          id?: string
          updated_at?: string
          video_type?: string
          video_url?: string
        }
        Relationships: []
      }
      battles: {
        Row: {
          battle_date: string
          created_at: string
          id: string
          scheduled_at: string
          status: string
        }
        Insert: {
          battle_date: string
          created_at?: string
          id?: string
          scheduled_at: string
          status?: string
        }
        Update: {
          battle_date?: string
          created_at?: string
          id?: string
          scheduled_at?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          board: string
          class_level: string
          created_at: string
          display_name: string | null
          id: string
          total_coins: number
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          board?: string
          class_level?: string
          created_at?: string
          display_name?: string | null
          id?: string
          total_coins?: number
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          board?: string
          class_level?: string
          created_at?: string
          display_name?: string | null
          id?: string
          total_coins?: number
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          battle_id: string | null
          board: string
          class_level: string
          correct_answer: number
          created_at: string
          difficulty: string
          id: string
          is_diamond: boolean
          options: Json
          question_order: number | null
          question_pool: string
          question_text: string
          subject: string
        }
        Insert: {
          battle_id?: string | null
          board: string
          class_level: string
          correct_answer: number
          created_at?: string
          difficulty: string
          id?: string
          is_diamond?: boolean
          options: Json
          question_order?: number | null
          question_pool: string
          question_text: string
          subject: string
        }
        Update: {
          battle_id?: string | null
          board?: string
          class_level?: string
          correct_answer?: number
          created_at?: string
          difficulty?: string
          id?: string
          is_diamond?: boolean
          options?: Json
          question_order?: number | null
          question_pool?: string
          question_text?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          battle_id: string | null
          coins_earned: number
          created_at: string
          id: string
          is_correct: boolean
          is_practice: boolean
          question_id: string
          selected_answer: number | null
          time_spent: number
          user_id: string
        }
        Insert: {
          battle_id?: string | null
          coins_earned?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          is_practice?: boolean
          question_id: string
          selected_answer?: number | null
          time_spent?: number
          user_id: string
        }
        Update: {
          battle_id?: string | null
          coins_earned?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          is_practice?: boolean
          question_id?: string
          selected_answer?: number | null
          time_spent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          answered_in_10sec: number
          answered_in_30sec: number
          answered_in_5sec: number
          correct_answers: number
          created_at: string
          current_level: string
          current_tier: number
          games_won: number
          id: string
          practice_correct: number
          practice_questions: number
          questions_to_next_tier: number
          top10_finishes: number
          top5_finishes: number
          total_questions: number
          updated_at: string
          user_id: string
          wrong_answers: number
        }
        Insert: {
          answered_in_10sec?: number
          answered_in_30sec?: number
          answered_in_5sec?: number
          correct_answers?: number
          created_at?: string
          current_level?: string
          current_tier?: number
          games_won?: number
          id?: string
          practice_correct?: number
          practice_questions?: number
          questions_to_next_tier?: number
          top10_finishes?: number
          top5_finishes?: number
          total_questions?: number
          updated_at?: string
          user_id: string
          wrong_answers?: number
        }
        Update: {
          answered_in_10sec?: number
          answered_in_30sec?: number
          answered_in_5sec?: number
          correct_answers?: number
          created_at?: string
          current_level?: string
          current_tier?: number
          games_won?: number
          id?: string
          practice_correct?: number
          practice_questions?: number
          questions_to_next_tier?: number
          top10_finishes?: number
          top5_finishes?: number
          total_questions?: number
          updated_at?: string
          user_id?: string
          wrong_answers?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
