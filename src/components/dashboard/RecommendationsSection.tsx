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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Recommended for You
        </CardTitle>
        <CardDescription>
          Trending theses based on recent activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.slice(0, 4).map((thesis) => (
            <div
              key={thesis.id}
              className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent"
              onClick={() => navigate(`/thesis/${thesis.id}`)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium line-clamp-2 group-hover:text-primary">
                    {thesis.title}
                  </h4>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {thesis.score}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  By {thesis.author} • {thesis.colleges.name}
                </p>
                
                {thesis.abstract && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {thesis.abstract}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {thesis.keywords?.slice(0, 2).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-primary font-medium">{thesis.reason}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recommendations available yet.</p>
              <p className="text-sm">Start reading theses to get personalized recommendations!</p>
            </div>
          )}
          
          {recommendations.length > 4 && (
            <Button 
              variant="outline" 
              className="w-full"
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