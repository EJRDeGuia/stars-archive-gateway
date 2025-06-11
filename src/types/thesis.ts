
export interface Thesis {
  id: string;
  title: string;
  author: string;
  college: string;
  abstract: string;
  keywords: string[];
  publishDate: string;
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
