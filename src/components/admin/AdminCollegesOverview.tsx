
import React from "react";
import CollegeCard from "@/components/CollegeCard";
import { Building } from "lucide-react";

interface AdminCollegesOverviewProps {
  colleges: any[];
  collegesLoading: boolean;
  onCollegeClick: (collegeId: string) => void;
}

const AdminCollegesOverview: React.FC<AdminCollegesOverviewProps> = ({
  colleges,
  collegesLoading,
  onCollegeClick
}) => (
  <div className="mb-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
      <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
        <Building className="w-5 h-5 text-white" />
      </div>
      Colleges Management
    </h2>
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {collegesLoading
          ? <div className="text-gray-400 col-span-3 text-center py-8">Loading colleges...</div>
          : colleges.slice(0, 3).map((college) => (
              <CollegeCard
                key={college.id}
                college={{
                  ...college,
                  icon: null,
                  bgColor: 'bg-gray-200',
                  bgColorLight: 'bg-gray-50',
                  textColor: 'text-gray-700',
                  borderColor: 'border-gray-200',
                  description: college.description,
                }}
                onClick={() => onCollegeClick(college.id)}
                size="large"
              />
          ))
        }
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {!collegesLoading && colleges.slice(3, 5).map((college) => (
          <CollegeCard
            key={college.id}
            college={{
              ...college,
              icon: null,
              bgColor: 'bg-gray-200',
              bgColorLight: 'bg-gray-50',
              textColor: 'text-gray-700',
              borderColor: 'border-gray-200',
              description: college.description,
            }}
            onClick={() => onCollegeClick(college.id)}
            size="large"
          />
        ))}
      </div>
    </div>
  </div>
);

export default AdminCollegesOverview;
