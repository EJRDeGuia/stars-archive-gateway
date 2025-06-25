
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

type Collection = {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string | null;
  _count?: {
    collection_theses: number;
  };
};

type FeaturedCollectionsCarouselProps = {
  collections: Collection[];
  loading: boolean;
};

const FeaturedCollectionsCarousel: React.FC<FeaturedCollectionsCarouselProps> = ({
  collections,
  loading
}) => {
  const navigate = useNavigate();

  const handleCollectionClick = (collectionId: string) => {
    navigate(`/collection/${collectionId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
        <p className="text-gray-600">Loading collections...</p>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No public collections available</h3>
          <p className="text-gray-500">
            Collections will appear here once they are created and made public by archivists.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {collections.map((collection) => (
            <CarouselItem key={collection.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <Card 
                className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gradient-to-br from-white to-gray-50/50"
                onClick={() => handleCollectionClick(collection.id)}
              >
                <CardContent className="p-0">
                  {/* Header with gradient background */}
                  <div className="relative bg-gradient-to-r from-dlsl-green to-dlsl-green/80 p-6 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-4 -translate-x-4"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30">
                          Featured
                        </Badge>
                        <BookOpen className="w-6 h-6 text-white/80" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-white/90 transition-colors">
                        {collection.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {collection.description || 'A curated collection of academic research papers and theses exploring various topics and methodologies.'}
                    </p>
                    
                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-dlsl-green">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="font-semibold text-sm">
                            {collection._count?.collection_theses || 0} theses
                          </span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-xs">Public</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Created {new Date(collection.created_at).toLocaleDateString()}</span>
                        {collection.updated_at && collection.updated_at !== collection.created_at && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Updated {new Date(collection.updated_at).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action indicator */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="w-12 h-1 bg-gradient-to-r from-dlsl-green to-dlsl-green/60 rounded-full"></div>
                      <span className="text-xs text-gray-400 group-hover:text-dlsl-green transition-colors">
                        Explore →
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 hover:bg-dlsl-green hover:text-white" />
        <CarouselNext className="hidden md:flex -right-12 hover:bg-dlsl-green hover:text-white" />
      </Carousel>
    </div>
  );
};

export default FeaturedCollectionsCarousel;
