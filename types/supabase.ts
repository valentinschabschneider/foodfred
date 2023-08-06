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
          consumer_id: string
          created_at: string
          id: string
          notes: string | null
          orderer_id: string
          price_in_cents: number
          product_name: string
          status: number
        }
        Insert: {
          consumer_id: string
          created_at?: string
          id?: string
          notes?: string | null
          orderer_id: string
          price_in_cents: number
          product_name: string
          status?: number
        }
        Update: {
          consumer_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          orderer_id?: string
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
            foreignKeyName: "order_entries_orderer_id_fkey"
            columns: ["orderer_id"]
            referencedRelation: "users"
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
        }
        Insert: {
          created_at?: string
          id?: string
          payee_id: string
          restaurant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          payee_id?: string
          restaurant_id?: string
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
          id: string
        }
        Insert: {
          auth_provider?: string | null
          auth_provider_id?: string | null
          id: string
        }
        Update: {
          auth_provider?: string | null
          auth_provider_id?: string | null
          id?: string
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
