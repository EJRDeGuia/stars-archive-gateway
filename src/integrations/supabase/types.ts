export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      about_content: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          section: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          section: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          section?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collection_theses: {
        Row: {
          added_at: string | null
          collection_id: string
          id: string
          thesis_id: string
        }
        Insert: {
          added_at?: string | null
          collection_id: string
          id?: string
          thesis_id: string
        }
        Update: {
          added_at?: string | null
          collection_id?: string
          id?: string
          thesis_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_theses_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_theses_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "recent_uploads_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_theses_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      colleges: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          full_name: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          full_name: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          full_name?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          college_id: string
          created_at: string | null
          degree_level: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          college_id: string
          created_at?: string | null
          degree_level: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          college_id?: string
          created_at?: string | null
          degree_level?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "recent_uploads_view"
            referencedColumns: ["college_id"]
          },
        ]
      }
      resources_content: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          order_index: number | null
          section: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          section: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          section?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          filters: Json | null
          id: string
          name: string
          query: string
          user_id: string
        }
        Insert: {
          created_at?: string
          filters?: Json | null
          id?: string
          name: string
          query: string
          user_id: string
        }
        Update: {
          created_at?: string
          filters?: Json | null
          id?: string
          name?: string
          query?: string
          user_id?: string
        }
        Relationships: []
      }
      system_statistics: {
        Row: {
          id: string
          stat_key: string
          stat_label: string
          stat_value: number
          updated_at: string
        }
        Insert: {
          id?: string
          stat_key: string
          stat_label: string
          stat_value?: number
          updated_at?: string
        }
        Update: {
          id?: string
          stat_key?: string
          stat_label?: string
          stat_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          order_index: number | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          order_index?: number | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      theses: {
        Row: {
          abstract: string | null
          adviser: string | null
          author: string
          co_adviser: string | null
          college_id: string
          cover_image_url: string | null
          created_at: string | null
          download_count: number | null
          embedding: string | null
          file_url: string | null
          id: string
          keywords: string[] | null
          program_id: string | null
          publish_date: string | null
          status: Database["public"]["Enums"]["thesis_status"]
          title: string
          updated_at: string | null
          uploaded_by: string | null
          view_count: number | null
        }
        Insert: {
          abstract?: string | null
          adviser?: string | null
          author: string
          co_adviser?: string | null
          college_id: string
          cover_image_url?: string | null
          created_at?: string | null
          download_count?: number | null
          embedding?: string | null
          file_url?: string | null
          id?: string
          keywords?: string[] | null
          program_id?: string | null
          publish_date?: string | null
          status?: Database["public"]["Enums"]["thesis_status"]
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          view_count?: number | null
        }
        Update: {
          abstract?: string | null
          adviser?: string | null
          author?: string
          co_adviser?: string | null
          college_id?: string
          cover_image_url?: string | null
          created_at?: string | null
          download_count?: number | null
          embedding?: string | null
          file_url?: string | null
          id?: string
          keywords?: string[] | null
          program_id?: string | null
          publish_date?: string | null
          status?: Database["public"]["Enums"]["thesis_status"]
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "theses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "recent_uploads_view"
            referencedColumns: ["college_id"]
          },
          {
            foreignKeyName: "theses_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_access_requests: {
        Row: {
          created_at: string
          id: string
          institution: string | null
          notes: string | null
          purpose: string
          requester_email: string
          requester_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          thesis_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          institution?: string | null
          notes?: string | null
          purpose: string
          requester_email: string
          requester_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          thesis_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          institution?: string | null
          notes?: string | null
          purpose?: string
          requester_email?: string
          requester_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          thesis_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      thesis_downloads: {
        Row: {
          downloaded_at: string | null
          id: string
          ip_address: unknown | null
          thesis_id: string
          user_id: string | null
        }
        Insert: {
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown | null
          thesis_id: string
          user_id?: string | null
        }
        Update: {
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown | null
          thesis_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thesis_downloads_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "recent_uploads_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_downloads_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_views: {
        Row: {
          id: string
          ip_address: unknown | null
          thesis_id: string
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          thesis_id: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          thesis_id?: string
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thesis_views_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "recent_uploads_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_views_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          thesis_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          thesis_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          thesis_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "recent_uploads_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      recent_uploads_view: {
        Row: {
          author: string | null
          college_id: string | null
          college_name: string | null
          created_at: string | null
          id: string | null
          status: Database["public"]["Enums"]["thesis_status"] | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_college_thesis_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          college_id: string
          college_name: string
          thesis_count: number
        }[]
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_theses: number
          approved_theses: number
          pending_review: number
          this_month_uploads: number
          total_collections: number
          total_views_7days: number
        }[]
      }
      get_recent_uploads: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          title: string
          author: string
          status: Database["public"]["Enums"]["thesis_status"]
          created_at: string
          college_name: string
          college_id: string
        }[]
      }
      get_uploads_analytics: {
        Args: { days_back?: number }
        Returns: {
          date: string
          uploads: number
        }[]
      }
      get_views_analytics: {
        Args: { days_back?: number }
        Returns: {
          date: string
          views: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_elevated_access: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin_or_archivist: {
        Args: { _user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      update_system_statistics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_thesis_status: {
        Args: {
          thesis_uuid: string
          new_status: Database["public"]["Enums"]["thesis_status"]
          user_uuid: string
        }
        Returns: {
          success: boolean
          message: string
          thesis_id: string
          thesis_title: string
          old_status: Database["public"]["Enums"]["thesis_status"]
          updated_status: Database["public"]["Enums"]["thesis_status"]
        }[]
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "archivist" | "researcher" | "guest_researcher"
      thesis_status:
        | "pending_review"
        | "approved"
        | "needs_revision"
        | "rejected"
      user_role: "researcher" | "archivist" | "admin" | "guest_researcher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "archivist", "researcher", "guest_researcher"],
      thesis_status: [
        "pending_review",
        "approved",
        "needs_revision",
        "rejected",
      ],
      user_role: ["researcher", "archivist", "admin", "guest_researcher"],
    },
  },
} as const
