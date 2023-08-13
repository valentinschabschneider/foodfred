export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      order_entries: {
        Row: {
          consumer_id: string | null
          created_at: string
          id: string
          note: string | null
          order_id: string
          price_in_cents: number
          product_name: string
          status: number
        }
        Insert: {
          consumer_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id: string
          price_in_cents: number
          product_name: string
          status?: number
        }
        Update: {
          consumer_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string
          price_in_cents?: number
          product_name?: string
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_entries_consumer_id_fkey"
            columns: ["consumer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_entries_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          payee_id: string
          restaurant_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          payee_id: string
          restaurant_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          payee_id?: string
          restaurant_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_payee_id_fkey"
            columns: ["payee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          }
        ]
      }
      restaurants: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_provider: string | null
          auth_provider_id: string | null
          display_name: string
          id: string
          image_url: string | null
        }
        Insert: {
          auth_provider?: string | null
          auth_provider_id?: string | null
          display_name: string
          id: string
          image_url?: string | null
        }
        Update: {
          auth_provider?: string | null
          auth_provider_id?: string | null
          display_name?: string
          id?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_consumer_in_order: {
        Args: {
          _user_id: string
          _order_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
