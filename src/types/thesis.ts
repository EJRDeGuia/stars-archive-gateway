
export interface Thesis {
  id: string;
  title: string;
  author: string;
  college_id: string;
  abstract: string;
  keywords: string[];
  publish_date: string;
  status: 'pending_review' | 'approved' | 'needs_revision' | 'rejected';
  fileUrl?: string;
  downloadCount?: number;
  adviser?: string;
  co_adviser?: string;
  cover_image_url?: string;
  created_at?: string;
  download_count?: number;
  embedding?: string;
  file_url?: string;
  program_id?: string;
  updated_at?: string;
  uploaded_by?: string;
  view_count?: number;
  colleges?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface College {
  id: string;
  name: string;
  full_name: string;
  color: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CollegeDisplay extends College {
  fullName: string;
  thesesCount: number;
  icon: any;
  bgColor: string;
  bgColorLight: string;
  textColor: string;
  borderColor: string;
}
