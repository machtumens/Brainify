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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_memory: {
        Row: {
          content: string
          id: string
          scope: string
          sections: Json | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          content?: string
          id?: string
          scope: string
          sections?: Json | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          content?: string
          id?: string
          scope?: string
          sections?: Json | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      memory_log: {
        Row: {
          created_at: string
          id: string
          scope: string
          summary: string | null
          trigger_type: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          scope: string
          summary?: string | null
          trigger_type: string
          user_id: string
          version: number
        }
        Update: {
          created_at?: string
          id?: string
          scope?: string
          summary?: string | null
          trigger_type?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      captures: {
        Row: {
          confidence: number | null
          content: string | null
          created_at: string
          filename_hash: string | null
          id: string
          source_type: string | null
          subject_tag: string | null
          topic_tag: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          content?: string | null
          created_at?: string
          filename_hash?: string | null
          id?: string
          source_type?: string | null
          subject_tag?: string | null
          topic_tag?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          content?: string | null
          created_at?: string
          filename_hash?: string | null
          id?: string
          source_type?: string | null
          subject_tag?: string | null
          topic_tag?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_log: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          job: string
          status: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          job: string
          status: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          job?: string
          status?: string
        }
        Relationships: []
      }
      sync_log: {
        Row: {
          errors: string[]
          files_found: number
          files_ingested: number
          id: string
          path_used: string | null
          run_at: string
        }
        Insert: {
          errors?: string[]
          files_found?: number
          files_ingested?: number
          id?: string
          path_used?: string | null
          run_at?: string
        }
        Update: {
          errors?: string[]
          files_found?: number
          files_ingested?: number
          id?: string
          path_used?: string | null
          run_at?: string
        }
        Relationships: []
      }
      errors: {
        Row: {
          created_at: string
          flagged_at: string
          id: string
          mistake_description: string | null
          problem_type: string | null
          session_id: string | null
          subtopic: string | null
          topic: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          flagged_at?: string
          id?: string
          mistake_description?: string | null
          problem_type?: string | null
          session_id?: string | null
          subtopic?: string | null
          topic?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          flagged_at?: string
          id?: string
          mistake_description?: string | null
          problem_type?: string | null
          session_id?: string | null
          subtopic?: string | null
          topic?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "errors_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string | null
          created_at: string
          current_month: number | null
          id: string
          roadmap: Json | null
          started_at: string | null
          status: string
          title: string
          total_months: number | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_month?: number | null
          id?: string
          roadmap?: Json | null
          started_at?: string | null
          status?: string
          title: string
          total_months?: number | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_month?: number | null
          id?: string
          roadmap?: Json | null
          started_at?: string | null
          status?: string
          title?: string
          total_months?: number | null
          user_id?: string
        }
        Relationships: []
      }
      retrospectives: {
        Row: {
          consistency_rate: number | null
          content: string | null
          coverage_rate: number | null
          created_at: string
          id: string
          period_start: string | null
          period_type: string | null
          risk_topic: string | null
          user_id: string
        }
        Insert: {
          consistency_rate?: number | null
          content?: string | null
          coverage_rate?: number | null
          created_at?: string
          id?: string
          period_start?: string | null
          period_type?: string | null
          risk_topic?: string | null
          user_id: string
        }
        Update: {
          consistency_rate?: number | null
          content?: string | null
          coverage_rate?: number | null
          created_at?: string
          id?: string
          period_start?: string | null
          period_type?: string | null
          risk_topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          difficulty: number | null
          id: string
          mode: string | null
          notes: string | null
          pages_done: number | null
          pomodoros: number | null
          problems_done: number | null
          started_at: string
          subject: string | null
          task_title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty?: number | null
          id?: string
          mode?: string | null
          notes?: string | null
          pages_done?: number | null
          pomodoros?: number | null
          problems_done?: number | null
          started_at?: string
          subject?: string | null
          task_title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty?: number | null
          id?: string
          mode?: string | null
          notes?: string | null
          pages_done?: number | null
          pomodoros?: number | null
          problems_done?: number | null
          started_at?: string
          subject?: string | null
          task_title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sources: {
        Row: {
          created_at: string
          id: string
          last_updated: string | null
          quality: string | null
          resource_id: string
          resource_type: string | null
          topic: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_updated?: string | null
          quality?: string | null
          resource_id: string
          resource_type?: string | null
          topic?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_updated?: string | null
          quality?: string | null
          resource_id?: string
          resource_type?: string | null
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          score: number | null
          subject: string | null
          test_type: string | null
          topics: string[] | null
          total: number | null
          user_id: string
          wrong_ids: string[] | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          score?: number | null
          subject?: string | null
          test_type?: string | null
          topics?: string[] | null
          total?: number | null
          user_id: string
          wrong_ids?: string[] | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          score?: number | null
          subject?: string | null
          test_type?: string | null
          topics?: string[] | null
          total?: number | null
          user_id?: string
          wrong_ids?: string[] | null
        }
        Relationships: []
      }
      textbooks: {
        Row: {
          active_from: string | null
          author: string | null
          created_at: string
          current_page: number | null
          id: string
          subject: string | null
          title: string
          topic_map: Json | null
          total_pages: number | null
          user_id: string
        }
        Insert: {
          active_from?: string | null
          author?: string | null
          created_at?: string
          current_page?: number | null
          id?: string
          subject?: string | null
          title: string
          topic_map?: Json | null
          total_pages?: number | null
          user_id: string
        }
        Update: {
          active_from?: string | null
          author?: string | null
          created_at?: string
          current_page?: number | null
          id?: string
          subject?: string | null
          title?: string
          topic_map?: Json | null
          total_pages?: number | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          preferences: Json | null
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          preferences?: Json | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          preferences?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
