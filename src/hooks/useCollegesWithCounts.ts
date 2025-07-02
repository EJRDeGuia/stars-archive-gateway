import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { collegeData } from '@/data/collegeData';

export interface CollegeWithCount {
  id: string;
  name: string;
  fullName: string;
  description: string;
  thesesCount: number;
  // Design properties from collegeData
  icon?: any;
  bgColor?: string;
  bgColorLight?: string;
  textColor?: string;
  borderColor?: string;
  color?: string;
  image?: string;
}

/**
 * Optimized hook to fetch colleges with their thesis counts
 * Uses database function for better performance
 */
export function useCollegesWithCounts() {
  return useQuery({
    queryKey: ['colleges-with-counts'],
    queryFn: async (): Promise<CollegeWithCount[]> => {
      // Get colleges with thesis counts from database function
      const { data, error } = await supabase.rpc('get_college_thesis_counts');
      
      if (error) {
        console.error('[useCollegesWithCounts] Error:', error);
        throw error;
      }

      // Map database data with design data
      const mappedColleges = (data || []).map((dbCollege: any) => {
        const designData = collegeData.find(design => 
          design.id === dbCollege.college_id || design.name === dbCollege.college_name
        );
        
        return {
          id: dbCollege.college_id,
          name: dbCollege.college_name,
          fullName: designData?.fullName || dbCollege.college_name,
          description: designData?.description || 'Advancing knowledge through innovative research and academic excellence',
          thesesCount: Number(dbCollege.thesis_count || 0),
          // Include design properties
          icon: designData?.icon,
          bgColor: designData?.bgColor || 'bg-gray-500',
          bgColorLight: designData?.bgColorLight || 'bg-gray-50',
          textColor: designData?.textColor || 'text-gray-600',
          borderColor: designData?.borderColor || 'border-gray-200',
          color: designData?.color || '#6b7280',
        };
      });
      
      return mappedColleges;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - college counts don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false,
    retry: 2,
  });
}