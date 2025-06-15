export interface Thesis {
  id: string;
  title: string;
  author: string;
  college_id: string; // update to use college_id as per table
  abstract: string;
  keywords: string[];
  publish_date: string;
  status: 'pending_review' | 'approved' | 'needs_revision';
  fileUrl?: string;
  downloadCount?: number;
}

export interface College {
  id: string;
  name: string;
  fullName: string;
  color: string;
  thesesCount: number;
  icon: any;
  bgColor: string;
  bgColorLight: string;
  textColor: string;
  borderColor: string;
  description: string;
}
