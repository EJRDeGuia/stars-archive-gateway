
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    fullName: string;
    thesesCount: number;
    image?: string;
  };
  onClick: () => void;
  size?: 'default' | 'large';
}

const CollegeCard = ({ college, onClick, size = 'default' }: CollegeCardProps) => {
  const isLarge = size === 'large';
  
  return (
    <Card 
      className="group hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-0 overflow-hidden transform hover:scale-105"
      onClick={onClick}
    >
      {/* Gradient Header */}
      <div className={`h-3 bg-gradient-to-r from-dlsl-green via-dlsl-green-light to-emerald-400 group-hover:h-4 transition-all duration-300`}></div>
      
      <CardContent className={`${isLarge ? 'p-10' : 'p-8'} relative`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-dlsl-green/20 to-transparent"></div>
        </div>
        
        <div className="relative text-center">
          {/* Icon */}
          <div className={`${isLarge ? 'w-28 h-28 mb-8' : 'w-24 h-24 mb-6'} bg-gradient-to-br from-dlsl-green/10 to-dlsl-green/20 rounded-3xl flex items-center justify-center mx-auto group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
            <BookOpen className={`${isLarge ? 'w-12 h-12' : 'w-10 h-10'} text-dlsl-green`} />
          </div>
          
          {/* College Name */}
          <h3 className={`${isLarge ? 'text-3xl mb-5' : 'text-2xl mb-4'} font-bold text-gray-900 group-hover:text-dlsl-green transition-colors duration-300 leading-tight`}>
            {college.name}
          </h3>
          
          {/* Full Name */}
          <p className={`${isLarge ? 'text-xl mb-8' : 'text-lg mb-6'} text-gray-600 leading-relaxed font-medium`}>
            {college.fullName}
          </p>
          
          {/* Description */}
          <p className={`${isLarge ? 'text-lg mb-10' : 'text-base mb-8'} text-gray-500 leading-relaxed`}>
            Comprehensive collection of academic research and scholarly work
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center">
            <div className={`${isLarge ? 'text-xl' : 'text-lg'} flex items-center gap-3 text-dlsl-green font-semibold`}>
              <BookOpen className="w-6 h-6" />
              <span>{college.thesesCount}+ theses</span>
            </div>
          </div>
          
          {/* Hover Effect Indicator */}
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-dlsl-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
