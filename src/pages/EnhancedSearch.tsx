
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedSearchInterface from '@/components/AdvancedSearchInterface';
import SemanticSearchInterface from '@/components/SemanticSearchInterface';
import SearchResultsGrid from '@/components/SearchResultsGrid';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';
import { SemanticSearchResult } from '@/hooks/useSemanticSearch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Brain, Filter } from 'lucide-react';

interface SearchFilters {
  query: string;
  college: string;
  yearFrom: string;
  yearTo: string;
  author: string;
  adviser: string;
  keywords: string[];
  status: string;
}

const EnhancedSearch: React.FC = () => {
  const { data: colleges } = useCollegesWithCounts();
  const [activeTab, setActiveTab] = useState('semantic');
  
  // Semantic search state
  const [semanticResults, setSemanticResults] = useState<SemanticSearchResult[]>([]);
  const [isSemanticLoading, setIsSemanticLoading] = useState(false);

  // Advanced search state  
  const [advancedResults, setAdvancedResults] = useState<any[]>([]);
  const [isAdvancedLoading, setIsAdvancedLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const [facets, setFacets] = useState<{
    colleges: any[];
    years: any[];
    authors: any[];
  }>({
    colleges: [],
    years: [],
    authors: []
  });

  const handleSemanticResults = (results: SemanticSearchResult[]) => {
    setSemanticResults(results);
  };

  const handleAdvancedSearch = async (filters: SearchFilters) => {
    setIsAdvancedLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('advanced-search', {
        body: {
          query: filters.query,
          college_id: filters.college,
          year_from: filters.yearFrom ? parseInt(filters.yearFrom) : null,
          year_to: filters.yearTo ? parseInt(filters.yearTo) : null,
          author: filters.author,
          adviser: filters.adviser,
          keywords: filters.keywords,
          status: filters.status || 'approved',
          page: currentPage,
          limit: 20
        }
      });

      if (error) {
        console.error('Advanced search error:', error);
        toast.error('Search failed. Please try again.');
        return;
      }

      if (data?.results) {
        setAdvancedResults(data.results);
        setTotalCount(data.totalCount || 0);
        setTotalPages(Math.ceil((data.totalCount || 0) / 20));
        setFacets(data.facets || { colleges: [], years: [], authors: [] });
      }
    } catch (error) {
      console.error('Advanced search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsAdvancedLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Re-run the last search with new page
    const lastFilters = localStorage.getItem('lastAdvancedSearch');
    if (lastFilters) {
      const filters = JSON.parse(lastFilters);
      handleAdvancedSearch(filters);
    }
  };

  const handleSortChange = (sort: string) => {
    // TODO: Implement sorting by updating search with sort parameter
    console.log('Sort changed to:', sort);
  };

  const handleFacetFilter = (type: string, value: string) => {
    // TODO: Implement facet filtering by updating search filters
    console.log('Facet filter:', type, value);
  };

  const handleViewThesis = (thesis: any) => {
    window.open(`/thesis/${thesis.id}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Search</h1>
          <p className="text-gray-600">
            Discover theses using AI-powered semantic search or advanced filtering
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="semantic" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Semantic Search
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Advanced Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="semantic" className="space-y-6">
            <SemanticSearchInterface
              onResults={handleSemanticResults}
            />
            
            {semanticResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Semantic Search Results ({semanticResults.length})
                </h2>
                
                <div className="space-y-4">
                  {semanticResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewThesis(result)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg leading-tight text-blue-600 hover:text-blue-800">
                          {result.title}
                        </h3>
                        {result.similarity_score && (
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {Math.round(result.similarity_score * 100)}% match
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">{result.author}</span>
                        {result.college_name && (
                          <span> • {result.college_name}</span>
                        )}
                        {result.publish_date && (
                          <span> • {new Date(result.publish_date).getFullYear()}</span>
                        )}
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-3">
                        {result.abstract}
                      </p>

                      {result.keywords && result.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {result.keywords.slice(0, 5).map((keyword, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <AdvancedSearchInterface
              onSearch={handleAdvancedSearch}
              colleges={colleges || []}
              isLoading={isAdvancedLoading}
            />
            
            {advancedResults.length > 0 && (
              <SearchResultsGrid
                results={advancedResults}
                totalCount={totalCount}
                isLoading={isAdvancedLoading}
                facets={facets}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onSortChange={handleSortChange}
                onFacetFilter={handleFacetFilter}
                onViewThesis={handleViewThesis}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedSearch;
