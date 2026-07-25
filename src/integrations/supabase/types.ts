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
      devices: {
        Row: {
          active: boolean
          base_resale_value: number
          buy_tier: number
          created_at: string
          device_type: string
          id: string
          image_url: string | null
          model_name: string
          release_year: number
          sort_order: number
          storage_options: number[]
          updated_at: string
        }
        Insert: {
          active?: boolean
          base_resale_value: number
          buy_tier: number
          created_at?: string
          device_type?: string
          id?: string
          image_url?: string | null
          model_name: string
          release_year: number
          sort_order?: number
          storage_options: number[]
          updated_at?: string
        }
        Update: {
          active?: boolean
          base_resale_value?: number
          buy_tier?: number
          created_at?: string
          device_type?: string
          id?: string
          image_url?: string | null
          model_name?: string
          release_year?: number
          sort_order?: number
          storage_options?: number[]
          updated_at?: string
        }
        Relationships: []
      }
      grade_multipliers: {
        Row: {
          description_me: string
          grade: string
          label_me: string
          multiplier: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          description_me: string
          grade: string
          label_me: string
          multiplier: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          description_me?: string
          grade?: string
          label_me?: string
          multiplier?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          battery_health: number
          color: string | null
          created_at: string
          description_me: string | null
          device_id: string
          grade: string
          id: string
          list_price: number
          photos: string[]
          status: string
          storage_gb: number
          updated_at: string
        }
        Insert: {
          battery_health: number
          color?: string | null
          created_at?: string
          description_me?: string | null
          device_id: string
          grade: string
          id?: string
          list_price: number
          photos?: string[]
          status?: string
          storage_gb: number
          updated_at?: string
        }
        Update: {
          battery_health?: number
          color?: string | null
          created_at?: string
          description_me?: string | null
          device_id?: string
          grade?: string
          id?: string
          list_price?: number
          photos?: string[]
          status?: string
          storage_gb?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          inventory_id: string | null
          item_snapshot: Json
          notes: string | null
          payment_method: string
          postal_code: string | null
          reference_code: string
          status: string
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          inventory_id?: string | null
          item_snapshot: Json
          notes?: string | null
          payment_method?: string
          postal_code?: string | null
          reference_code: string
          status?: string
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          inventory_id?: string | null
          item_snapshot?: Json
          notes?: string | null
          payment_method?: string
          postal_code?: string | null
          reference_code?: string
          status?: string
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_config: {
        Row: {
          diagnostic_min_battery: number
          id: number
          list_price_ending: number
          min_payout_floor: number
          round_step: number
          target_margin: number
          tier2_flat_payout: number
          updated_at: string
          warranty_reserve: number
        }
        Insert: {
          diagnostic_min_battery?: number
          id?: number
          list_price_ending?: number
          min_payout_floor?: number
          round_step?: number
          target_margin?: number
          tier2_flat_payout?: number
          updated_at?: string
          warranty_reserve?: number
        }
        Update: {
          diagnostic_min_battery?: number
          id?: number
          list_price_ending?: number
          min_payout_floor?: number
          round_step?: number
          target_margin?: number
          tier2_flat_payout?: number
          updated_at?: string
          warranty_reserve?: number
        }
        Relationships: []
      }
      refurb_cost_items: {
        Row: {
          active: boolean
          amount: number
          key: string
          label_me: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount: number
          key: string
          label_me: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: number
          key?: string
          label_me?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      storage_multipliers: {
        Row: {
          multiplier: number
          storage_gb: number
          updated_at: string
        }
        Insert: {
          multiplier: number
          storage_gb: number
          updated_at?: string
        }
        Update: {
          multiplier?: number
          storage_gb?: number
          updated_at?: string
        }
        Relationships: []
      }
      trade_in_submissions: {
        Row: {
          battery_health: number
          breakdown: Json
          calculated_payout: number | null
          cosmetic_grade: string | null
          cracked_back: boolean
          cracked_screen: boolean
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          device_id: string | null
          dropoff_city: string | null
          dropoff_method: string
          effective_grade: string | null
          functional_answers: Json
          id: string
          model_name: string
          notes: string | null
          reference_code: string
          refurb_cost: number | null
          rejection_reason: string | null
          resale_value: number | null
          screening_answers: Json
          status: string
          storage_gb: number
          updated_at: string
        }
        Insert: {
          battery_health: number
          breakdown?: Json
          calculated_payout?: number | null
          cosmetic_grade?: string | null
          cracked_back?: boolean
          cracked_screen?: boolean
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          device_id?: string | null
          dropoff_city?: string | null
          dropoff_method: string
          effective_grade?: string | null
          functional_answers?: Json
          id?: string
          model_name: string
          notes?: string | null
          reference_code: string
          refurb_cost?: number | null
          rejection_reason?: string | null
          resale_value?: number | null
          screening_answers?: Json
          status?: string
          storage_gb: number
          updated_at?: string
        }
        Update: {
          battery_health?: number
          breakdown?: Json
          calculated_payout?: number | null
          cosmetic_grade?: string | null
          cracked_back?: boolean
          cracked_screen?: boolean
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          device_id?: string | null
          dropoff_city?: string | null
          dropoff_method?: string
          effective_grade?: string | null
          functional_answers?: Json
          id?: string
          model_name?: string
          notes?: string | null
          reference_code?: string
          refurb_cost?: number | null
          rejection_reason?: string | null
          resale_value?: number | null
          screening_answers?: Json
          status?: string
          storage_gb?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_in_submissions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
