import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { AdvancedSearchFilters } from '@/components/search/AdvancedSearchFilters';
import { Search, Sparkles, Filter, SortAsc, SortDesc, BookOpen, User, Calendar, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdvancedSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title' | 'author' | 'popularity'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchType, setSearchType] = useState<'comprehensive' | 'semantic'>('comprehensive');
  const [currentPage, setCurrentPage] = useState(1);

  const { results, pagination, searchMeta, loading, error, actions } = useAdvancedSearch();

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, []);

  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim() && Object.keys(filters).length === 0) return;

    actions.search({
      query: searchQuery,
      filters,
      sortBy,
      sortOrder,
      page: currentPage,
      limit: 12,
      searchType
    });

    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    actions.search({
      query,
      filters,
      sortBy,
      sortOrder,
      page,
      limit: 12,
      searchType
    });
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
    setCurrentPage(1);
    actions.clearResults();
    setSearchParams({});
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Advanced Search</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use advanced filters and AI-powered search to find exactly what you're looking for
            </p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search theses, authors, keywords..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Select value={searchType} onValueChange={(value: 'comprehensive' | 'semantic') => setSearchType(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Comprehensive
                      </div>
                    </SelectItem>
                    <SelectItem value="semantic">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        AI Semantic
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => handleSearch()} className="px-8">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <AdvancedSearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Header */}
              {(results.length > 0 || loading) && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {!loading && pagination && (
                          <p className="text-sm text-muted-foreground">
                            {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalResults)} of{' '}
                            <span className="font-medium">{pagination.totalResults}</span> results
                            {searchMeta?.query && (
                              <span> for "<span className="font-medium">{searchMeta.query}</span>"</span>
                            )}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select value={sortBy} onValueChange={(value: 'relevance' | 'date' | 'title' | 'author' | 'popularity') => setSortBy(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="relevance">Relevance</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="author">Author</SelectItem>
                            <SelectItem value="popularity">Popularity</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleSortOrder}
                          className="px-2"
                        >
                          {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {loading && (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-destructive">Error: {error}</p>
                    <Button onClick={() => handleSearch()} className="mt-4">
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div className="space-y-4">
                  {results.map((thesis) => (
                    <Card
                      key={thesis.id}
                      className="cursor-pointer transition-colors hover:bg-accent"
                      onClick={() => navigate(`/thesis/${thesis.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary">
                              {thesis.title}
                            </h3>
                            <Badge variant="secondary" className="ml-2 flex-shrink-0">
                              {thesis.relevanceScore}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {thesis.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {thesis.colleges.name}
                            </span>
                            {thesis.publish_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(thesis.publish_date).getFullYear()}
                              </span>
                            )}
                          </div>

                          {thesis.abstract && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {thesis.abstract}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {thesis.keywords?.slice(0, 3).map((keyword) => (
                                <Badge key={keyword} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                              {thesis.keywords?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{thesis.keywords.length - 3} more
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {thesis.view_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {thesis.download_count}
                              </span>
                            </div>
                          </div>

                          {thesis.matchedFields.length > 0 && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">Matched in:</span>
                              {thesis.matchedFields.map((field) => (
                                <Badge key={field} variant="secondary" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && results.length === 0 && (query || Object.keys(filters).length > 0) && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search query or filters
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPreviousPage}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={page === pagination.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          );
                        })}
                        {pagination.totalPages > 5 && (
                          <>
                            <span className="text-muted-foreground">...</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePageChange(pagination.totalPages)}
                              className="w-10"
                            >
                              {pagination.totalPages}
                            </Button>
                          </>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdvancedSearchPage;