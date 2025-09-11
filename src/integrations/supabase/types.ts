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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          priority: number | null
          target_roles: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          priority?: number | null
          target_roles?: string[] | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          priority?: number | null
          target_roles?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
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
      content_versions: {
        Row: {
          content_data: Json
          content_id: string
          content_table: string
          created_at: string
          created_by: string | null
          id: string
          version_number: number
        }
        Insert: {
          content_data: Json
          content_id: string
          content_table: string
          created_at?: string
          created_by?: string | null
          id?: string
          version_number: number
        }
        Update: {
          content_data?: Json
          content_id?: string
          content_table?: string
          created_at?: string
          created_by?: string | null
          id?: string
          version_number?: number
        }
        Relationships: []
      }
      failed_login_attempts: {
        Row: {
          attempted_at: string
          blocked_until: string | null
          email: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          attempted_at?: string
          blocked_until?: string | null
          email?: string | null
          id?: string
          ip_address: unknown
          user_agent?: string | null
        }
        Update: {
          attempted_at?: string
          blocked_until?: string | null
          email?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: []
      }
      file_scan_results: {
        Row: {
          created_at: string
          file_path: string
          id: string
          quarantined: boolean
          scan_provider: string
          scan_results: Json | null
          scan_status: string
          scanned_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          quarantined?: boolean
          scan_provider?: string
          scan_results?: Json | null
          scan_status?: string
          scanned_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          quarantined?: boolean
          scan_provider?: string
          scan_results?: Json | null
          scan_status?: string
          scanned_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      guest_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      ip_reputation: {
        Row: {
          blocked: boolean | null
          created_at: string | null
          id: string
          ip_address: unknown
          last_updated: string | null
          metadata: Json | null
          reputation_score: number | null
          source: string | null
          threat_types: string[] | null
        }
        Insert: {
          blocked?: boolean | null
          created_at?: string | null
          id?: string
          ip_address: unknown
          last_updated?: string | null
          metadata?: Json | null
          reputation_score?: number | null
          source?: string | null
          threat_types?: string[] | null
        }
        Update: {
          blocked?: boolean | null
          created_at?: string | null
          id?: string
          ip_address?: unknown
          last_updated?: string | null
          metadata?: Json | null
          reputation_score?: number | null
          source?: string | null
          threat_types?: string[] | null
        }
        Relationships: []
      }
      lrc_approval_requests: {
        Row: {
          expires_at: string | null
          id: string
          justification: string
          request_type: string
          requested_at: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          thesis_id: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          justification: string
          request_type: string
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          thesis_id: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          justification?: string
          request_type?: string
          requested_at?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          thesis_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lrc_approval_requests_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "recent_uploads_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lrc_approval_requests_thesis_id_fkey"
            columns: ["thesis_id"]
            isOneToOne: false
            referencedRelation: "theses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
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
      rate_limits: {
        Row: {
          action: string
          blocked: boolean | null
          count: number | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action: string
          blocked?: boolean | null
          count?: number | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action?: string
          blocked?: boolean | null
          count?: number | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
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
      saved_conversations: {
        Row: {
          conversation_data: Json
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          conversation_data?: Json
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          conversation_data?: Json
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
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
      security_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      session_tracking: {
        Row: {
          created_at: string
          device_fingerprint: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_activity: string
          location_data: Json | null
          session_token: string
          session_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint?: Json | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          location_data?: Json | null
          session_token: string
          session_type?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          location_data?: Json | null
          session_token?: string
          session_type?: string
          user_agent?: string | null
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
      can_access_thesis_file: {
        Args: { _thesis_id: string; _user_id?: string }
        Returns: boolean
      }
      check_failed_login_attempts: {
        Args: { _email?: string; _ip_address: unknown }
        Returns: {
          attempts_count: number
          blocked_until: string
          is_blocked: boolean
        }[]
      }
      check_ip_reputation: {
        Args: { _ip_address: unknown }
        Returns: Json
      }
      check_rate_limit: {
        Args: {
          _action: string
          _identifier: string
          _limit?: number
          _window_minutes?: number
        }
        Returns: Json
      }
      create_user_session: {
        Args: {
          _device_fingerprint?: Json
          _expires_in_hours?: number
          _ip_address?: unknown
          _location_data?: Json
          _session_token: string
          _session_type?: string
          _user_agent?: string
          _user_id: string
        }
        Returns: string
      }
      detect_user_anomalies: {
        Args: { _user_id: string }
        Returns: undefined
      }
      encrypt_sensitive_field: {
        Args: { _data: string; _key?: string }
        Returns: string
      }
      enhanced_audit_log: {
        Args: {
          _action: string
          _additional_metadata?: Json
          _new_data?: Json
          _old_data?: Json
          _resource_id?: string
          _resource_type: string
          _risk_level?: string
        }
        Returns: string
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
          approved_theses: number
          pending_review: number
          this_month_uploads: number
          total_collections: number
          total_theses: number
          total_views_7days: number
        }[]
      }
      get_recent_uploads: {
        Args: Record<PropertyKey, never>
        Returns: {
          author: string
          college_id: string
          college_name: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["thesis_status"]
          title: string
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
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
      log_audit_event: {
        Args: {
          _action: string
          _details?: Json
          _ip_address?: unknown
          _resource_id?: string
          _resource_type: string
          _user_agent?: string
        }
        Returns: string
      }
      log_failed_login: {
        Args: { _email: string; _ip_address: unknown; _user_agent?: string }
        Returns: undefined
      }
      mask_sensitive_data: {
        Args: { _data: string; _mask_type?: string }
        Returns: string
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
          new_status: Database["public"]["Enums"]["thesis_status"]
          thesis_uuid: string
          user_uuid: string
        }
        Returns: {
          message: string
          old_status: Database["public"]["Enums"]["thesis_status"]
          success: boolean
          thesis_id: string
          thesis_title: string
          updated_status: Database["public"]["Enums"]["thesis_status"]
        }[]
      }
      validate_session_security: {
        Args: {
          _current_ip: unknown
          _current_user_agent: string
          _session_token: string
        }
        Returns: Json
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
