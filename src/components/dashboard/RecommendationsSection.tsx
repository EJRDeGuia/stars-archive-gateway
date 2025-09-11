import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { BookOpen, TrendingUp, Sparkles, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecommendationsSection = () => {
  const navigate = useNavigate();
  const { recommendations, loading, actions } = useAIRecommendations();

  useEffect(() => {
    actions.getTrendingRecommendations();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            Trending theses you might find interesting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg hover-scale transition-all duration-300 animate-fade-in border-0 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="bg-gradient-to-r from-dlsl-green/10 to-emerald-50 border-b">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <div className="p-2 bg-dlsl-green/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-dlsl-green" />
          </div>
          Recommended for You
        </CardTitle>
        <CardDescription className="text-gray-600">
          Trending theses based on recent activity
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recommendations.slice(0, 4).map((thesis, index) => (
            <div
              key={thesis.id}
              className="group cursor-pointer rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:bg-white hover:border-dlsl-green/20 hover-scale"
              onClick={() => navigate(`/thesis/${thesis.id}`)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold line-clamp-2 group-hover:text-dlsl-green transition-colors duration-200">
                    {thesis.title}
                  </h4>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0 bg-dlsl-green/10 text-dlsl-green border-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {thesis.score}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600">
                  By <span className="font-medium">{thesis.author}</span> • <span className="text-dlsl-green">{thesis.colleges.name}</span>
                </p>
                
                {thesis.abstract && (
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {thesis.abstract}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {thesis.keywords?.slice(0, 2).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs border-dlsl-green/30 text-dlsl-green hover:bg-dlsl-green/5">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-dlsl-green font-medium bg-dlsl-green/10 px-2 py-1 rounded-full">
                      {thesis.reason}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-dlsl-green/10 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-dlsl-green" />
              </div>
              <p className="text-gray-600 font-medium mb-2">No recommendations available yet.</p>
              <p className="text-sm text-gray-500">Start reading theses to get personalized recommendations!</p>
            </div>
          )}
          
          {recommendations.length > 4 && (
            <Button 
              variant="outline" 
              className="w-full mt-6 border-dlsl-green text-dlsl-green hover:bg-dlsl-green hover:text-white transition-all duration-300"
              onClick={() => navigate('/explore')}
            >
              View All Recommendations
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};