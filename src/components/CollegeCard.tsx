
import { Card, CardContent } from '@/components/ui/card';

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    fullName: string;
    thesesCount: number;
    color: string;
    bgColor: string;
    bgColorLight: string;
    textColor: string;
    borderColor: string;
    icon: any;
    image?: string;
  };
  onClick: () => void;
  size?: 'default' | 'large';
}

const CollegeCard = ({ college, onClick, size = 'default' }: CollegeCardProps) => {
  const isLarge = size === 'large';
  const IconComponent = college.icon;
  
  return (
    <Card 
      className="group hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-0 overflow-hidden transform hover:scale-105"
      onClick={onClick}
    >
      {/* Gradient Header with college color */}
      <div className={`h-3 ${college.bgColor} group-hover:h-4 transition-all duration-300`}></div>
      
      <CardContent className={`${isLarge ? 'p-10' : 'p-8'} relative`}>
        {/* Background Pattern with college color */}
        <div className="absolute inset-0 opacity-5">
          <div className={`w-full h-full bg-gradient-to-br ${college.bgColorLight} to-transparent`}></div>
        </div>
        
        <div className="relative text-center">
          {/* Icon with college color */}
          <div className={`${isLarge ? 'w-28 h-28 mb-8' : 'w-24 h-24 mb-6'} ${college.bgColorLight} rounded-3xl flex items-center justify-center mx-auto group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
            <IconComponent className={`${isLarge ? 'w-12 h-12' : 'w-10 h-10'} ${college.textColor}`} />
          </div>
          
          {/* College Name */}
          <h3 className={`${isLarge ? 'text-3xl mb-5' : 'text-2xl mb-4'} font-bold text-gray-900 group-hover:${college.textColor} transition-colors duration-300 leading-tight`}>
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
            <div className={`${isLarge ? 'text-xl' : 'text-lg'} flex items-center gap-3 ${college.textColor} font-semibold`}>
              <IconComponent className="w-6 h-6" />
              <span>{college.thesesCount}+ theses</span>
            </div>
          </div>
          
          {/* Hover Effect Indicator with college color */}
          <div className={`absolute bottom-4 right-4 w-3 h-3 ${college.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
