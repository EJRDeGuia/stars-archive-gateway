
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Download, Heart, Calendar, User, Building, BookOpen, Search, SlidersHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import FavoriteButton from './FavoriteButton';

interface Thesis {
  id: string;
  title: string;
  author: string;
  adviser?: string;
  abstract: string;
  keywords?: string[];
  college_name?: string;
  publish_date?: string;
  view_count?: number;
  download_count?: number;
  cover_image_url?: string;
}

interface Facet {
  label: string;
  count: number;
  value: string;
}

interface SearchResultsGridProps {
  results: Thesis[];
  totalCount: number;
  isLoading: boolean;
  facets: {
    colleges: Facet[];
    years: Facet[];
    authors: Facet[];
  };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
  onFacetFilter: (type: string, value: string) => void;
  onViewThesis: (thesis: Thesis) => void;
}

const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  results,
  totalCount,
  isLoading,
  facets,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  onFacetFilter,
  onViewThesis
}) => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState('relevance');
  const [showFacets, setShowFacets] = useState(true);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).getFullYear().toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Faceted Filters Sidebar */}
      {showFacets && (
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Refine Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Colleges Facet */}
              {facets.colleges.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Colleges
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {facets.colleges.map((college) => (
                      <Button
                        key={college.value}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-left h-auto p-2"
                        onClick={() => onFacetFilter('college', college.value)}
                      >
                        <span className="truncate">{college.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {college.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Years Facet */}
              {facets.years.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Years
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {facets.years.map((year) => (
                      <Button
                        key={year.value}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-left h-auto p-2"
                        onClick={() => onFacetFilter('year', year.value)}
                      >
                        <span>{year.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {year.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Top Authors Facet */}
              {facets.authors.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Top Authors
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {facets.authors.slice(0, 10).map((author) => (
                      <Button
                        key={author.value}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-left h-auto p-2"
                        onClick={() => onFacetFilter('author', author.value)}
                      >
                        <span className="truncate">{author.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {author.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Area */}
      <div className={showFacets ? 'lg:col-span-3' : 'lg:col-span-4'}>
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              Search Results ({totalCount.toLocaleString()})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFacets(!showFacets)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date_desc">Newest First</SelectItem>
              <SelectItem value="date_asc">Oldest First</SelectItem>
              <SelectItem value="title_asc">Title A-Z</SelectItem>
              <SelectItem value="title_desc">Title Z-A</SelectItem>
              <SelectItem value="views_desc">Most Viewed</SelectItem>
              <SelectItem value="downloads_desc">Most Downloaded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((thesis) => (
              <Card key={thesis.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                      {thesis.cover_image_url ? (
                        <img
                          src={thesis.cover_image_url}
                          alt={thesis.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 
                          className="font-semibold text-lg leading-tight cursor-pointer hover:text-dlsl-green"
                          onClick={() => onViewThesis(thesis)}
                        >
                          {thesis.title}
                        </h3>
                        {user && (
                          <FavoriteButton 
                            userId={user.id} 
                            thesisId={thesis.id} 
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {thesis.author}
                        </span>
                        {thesis.college_name && (
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {thesis.college_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(thesis.publish_date)}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                        {thesis.abstract}
                      </p>

                      {/* Keywords */}
                      {thesis.keywords && thesis.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {thesis.keywords.slice(0, 5).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {thesis.keywords.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{thesis.keywords.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions and Stats */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {thesis.view_count || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {thesis.download_count || 0} downloads
                          </span>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => onViewThesis(thesis)}
                          className="bg-dlsl-green hover:bg-dlsl-green/90"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsGrid;
