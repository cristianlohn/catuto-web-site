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
      site_settings: {
        Row: {
          id: string
          company_name: string
          cnpj: string | null
          primary_phone: string | null
          whatsapp_number: string | null
          contact_email: string | null
          address: string | null
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          favicon_url: string | null
          hero_title: string | null
          hero_subtitle: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_name?: string
          cnpj?: string | null
          primary_phone?: string | null
          whatsapp_number?: string | null
          contact_email?: string | null
          address?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string
          cnpj?: string | null
          primary_phone?: string | null
          whatsapp_number?: string | null
          contact_email?: string | null
          address?: string | null
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_monitors: {
        Row: {
          id: string
          name: string
          url: string
          expected_status: number | null
          is_active: boolean | null
          last_status: number | string | null
          last_checked_at: string | null
          consecutive_failures: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          url: string
          expected_status?: number | null
          is_active?: boolean | null
          last_status?: number | string | null
          last_checked_at?: string | null
          consecutive_failures?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          url?: string
          expected_status?: number | null
          is_active?: boolean | null
          last_status?: number | string | null
          last_checked_at?: string | null
          consecutive_failures?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      uptime_logs: {
        Row: {
          id: string
          monitor_id: string
          status_code: number | null
          response_time_ms: number | null
          is_up: boolean | null
          error_message: string | null
          checked_at: string | null
        }
        Insert: {
          id?: string
          monitor_id: string
          status_code?: number | null
          response_time_ms?: number | null
          is_up?: boolean | null
          error_message?: string | null
          checked_at?: string | null
        }
        Update: {
          id?: string
          monitor_id?: string
          status_code?: number | null
          response_time_ms?: number | null
          is_up?: boolean | null
          error_message?: string | null
          checked_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          company: string
          service: string
          message: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          company: string
          service: string
          message: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          company?: string
          service?: string
          message?: string
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          website_url: string
          category: string | null
          description: string | null
          tags: string[] | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          website_url: string
          category?: string | null
          description?: string | null
          tags?: string[] | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          website_url?: string
          category?: string | null
          description?: string | null
          tags?: string[] | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_pageviews: {
        Row: {
          id: string
          monitor_id: string | null
          domain: string
          path: string
          referrer: string | null
          device_type: string | null
          browser: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          monitor_id?: string | null
          domain: string
          path?: string
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          monitor_id?: string | null
          domain?: string
          path?: string
          referrer?: string | null
          device_type?: string | null
          browser?: string | null
          session_id?: string | null
          created_at?: string
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

// Tipagem unificada para a aplicação com propriedades de UI
export interface SiteSettings {
  id: string
  company_name: string
  trade_name?: string | null
  tagline?: string | null
  hero_badge?: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_cta_text?: string | null
  hero_cta_url?: string | null
  phone?: string | null
  whatsapp?: string | null
  whatsapp_message?: string | null
  email?: string | null
  cnpj?: string | null
  address?: string | null
  instagram_url?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  logo_url?: string | null
  favicon_url?: string | null
  meta_title?: string | null
  meta_description?: string | null
  about_text?: string | null
  services_data?: Json | null
  metrics_data?: Json | null
  updated_at?: string
}

export type Client = Database['public']['Tables']['clients']['Row']
export type ClientMonitor = Database['public']['Tables']['client_monitors']['Row']
export type UptimeLog = Database['public']['Tables']['uptime_logs']['Row']
export type ContactMessage = Database['public']['Tables']['contact_messages']['Row']
export type SitePageview = Database['public']['Tables']['site_pageviews']['Row']
