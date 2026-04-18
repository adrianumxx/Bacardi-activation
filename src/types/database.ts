export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "client" | "admin";

export type CatalogStatus = "draft" | "active" | "archived";

export type ActivationType = "ORDER_PROMO" | "ONSITE_EVENT";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          company_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name?: string | null;
          company_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string | null;
          company_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      client_attributes: {
        Row: {
          profile_id: string;
          attributes: Json;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          attributes?: Json;
          updated_at?: string;
        };
        Update: {
          profile_id?: string;
          attributes?: Json;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "client_attributes_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      catalogs: {
        Row: {
          id: string;
          name: string;
          starts_at: string;
          ends_at: string;
          status: CatalogStatus;
          attribute_schema: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          starts_at: string;
          ends_at: string;
          status?: CatalogStatus;
          attribute_schema?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          starts_at?: string;
          ends_at?: string;
          status?: CatalogStatus;
          attribute_schema?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      activations: {
        Row: {
          id: string;
          catalog_id: string;
          type: ActivationType;
          title: string;
          description: string | null;
          product_name: string | null;
          cocktail_name: string | null;
          requirements: Json;
          requirements_markdown: string | null;
          bookings_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          catalog_id: string;
          type: ActivationType;
          title: string;
          description?: string | null;
          product_name?: string | null;
          cocktail_name?: string | null;
          requirements?: Json;
          requirements_markdown?: string | null;
          bookings_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          catalog_id?: string;
          type?: ActivationType;
          title?: string;
          description?: string | null;
          product_name?: string | null;
          cocktail_name?: string | null;
          requirements?: Json;
          requirements_markdown?: string | null;
          bookings_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activations_catalog_id_fkey";
            columns: ["catalog_id"];
            referencedRelation: "catalogs";
            referencedColumns: ["id"];
          },
        ];
      };
      booking_click_logs: {
        Row: {
          id: string;
          profile_id: string;
          activation_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          activation_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          activation_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "booking_click_logs_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_click_logs_activation_id_fkey";
            columns: ["activation_id"];
            referencedRelation: "activations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
