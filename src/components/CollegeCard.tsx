
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
    description?: string;
  };
  onClick: () => void;
  size?: 'default' | 'large';
}

const CollegeCard = ({ college, onClick, size = 'default' }: CollegeCardProps) => {
  const isLarge = size === 'large';
  const IconComponent = college.icon;
  
  // Map college names to their respective uploaded images
  const getCollegeBackgroundImage = (collegeName: string) => {
    switch (collegeName.toLowerCase()) {
      case 'cite':
        return '/lovable-uploads/27c09e44-0b10-429b-bc06-05f3a5124d36.png';
      case 'cbeam':
        return '/lovable-uploads/1b0681ef-72c8-4649-9b12-47e3d1fc6239.png';
      case 'ceas':
        return '/lovable-uploads/35ad8e3f-40aa-4c24-bc92-5393417d2379.png';
      case 'con':
        return '/lovable-uploads/ba5d37d3-1cc2-4915-93bc-1f698e36177b.png';
      case 'cihtm':
        return '/lovable-uploads/442339ca-fa3b-43f5-bb23-46791d131f12.png';
      default:
        return '';
    }
  };

  const backgroundImage = getCollegeBackgroundImage(college.name);
  
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-0 overflow-hidden relative"
      onClick={onClick}
    >
      {/* Background image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
      )}
      
      {/* Colored top bar */}
      <div className={`h-3 ${college.bgColor} relative z-10`}></div>
      
      <CardContent className={`${isLarge ? 'p-8' : 'p-6'} text-center relative z-10`}>
        {/* Icon with colored background */}
        <div className={`${isLarge ? 'w-20 h-20 mb-6' : 'w-16 h-16 mb-4'} ${college.bgColorLight} rounded-2xl flex items-center justify-center mx-auto`}>
          <IconComponent className={`${isLarge ? 'w-10 h-10' : 'w-8 h-8'} ${college.textColor}`} />
        </div>
        
        {/* College Name */}
        <h3 className={`${isLarge ? 'text-2xl mb-4' : 'text-xl mb-3'} font-bold text-gray-900`}>
          {college.name}
        </h3>
        
        {/* Full Name */}
        <p className={`${isLarge ? 'text-base mb-4' : 'text-sm mb-3'} text-gray-600 leading-relaxed`}>
          {college.fullName}
        </p>
        
        {/* Description */}
        <p className={`${isLarge ? 'text-sm mb-6' : 'text-xs mb-4'} text-gray-500 leading-relaxed`}>
          {college.description || 'Comprehensive collection of academic research and scholarly work'}
        </p>
        
        {/* Thesis Count with icon */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-4 h-4 ${college.bgColor} rounded`}></div>
          <span className={`${isLarge ? 'text-base' : 'text-sm'} text-gray-700 font-medium`}>
            {college.thesesCount}+ Theses
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollegeCard;
