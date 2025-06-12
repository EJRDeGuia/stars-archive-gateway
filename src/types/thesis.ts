
import type { Database } from '@/integrations/supabase/types';

export type Thesis = Database['public']['Tables']['theses']['Row'] & {
  colleges?: Database['public']['Tables']['colleges']['Row'];
  programs?: Database['public']['Tables']['programs']['Row'];
};

export type College = Database['public']['Tables']['colleges']['Row'] & {
  thesesCount?: number;
  icon?: any;
  bgColor?: string;
  bgColorLight?: string;
  textColor?: string;
  borderColor?: string;
};

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  colleges?: Database['public']['Tables']['colleges']['Row'];
};

export type Program = Database['public']['Tables']['programs']['Row'] & {
  colleges?: Database['public']['Tables']['colleges']['Row'];
};

export type UserRole = Database['public']['Enums']['user_role'];
export type ThesisStatus = Database['public']['Enums']['thesis_status'];
