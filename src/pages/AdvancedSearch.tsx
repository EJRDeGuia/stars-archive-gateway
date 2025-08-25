
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdvancedSearchInterface from '@/components/AdvancedSearchInterface';
import SearchResultsGrid from '@/components/SearchResultsGrid';
import { supabase } from '@/integrations/supabase/client';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLog } from '@/hooks/useAuditLog';
import { toast } from 'sonner';

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

const AdvancedSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logEvent } = useAuditLog();
  const { data: colleges } = useCollegesWithCounts();

  const [results, setResults] = useState<Thesis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  
  const [facets, setFacets] = useState<{
    colleges: Facet[];
    years: Facet[];
    authors: Facet[];
  }>({
    colleges: [],
    years: [],
    authors: []
  });

  const RESULTS_PER_PAGE = 20;

  // Initialize filters from URL params
  const getFiltersFromParams = (): SearchFilters => {
    return {
      query: searchParams.get('q') || '',
      college: searchParams.get('college') || '',
      yearFrom: searchParams.get('yearFrom') || '',
      yearTo: searchParams.get('yearTo') || '',
      author: searchParams.get('author') || '',
      adviser: searchParams.get('adviser') || '',
      keywords: searchParams.get('keywords')?.split(',').filter(Boolean) || [],
      status: 'approved'
    };
  };

  const updateUrlParams = (filters: SearchFilters) => {
    const params = new URLSearchParams();
    
    if (filters.query) params.set('q', filters.query);
    if (filters.college) params.set('college', filters.college);
    if (filters.yearFrom) params.set('yearFrom', filters.yearFrom);
    if (filters.yearTo) params.set('yearTo', filters.yearTo);
    if (filters.author) params.set('author', filters.author);
    if (filters.adviser) params.set('adviser', filters.adviser);
    if (filters.keywords.length > 0) params.set('keywords', filters.keywords.join(','));
    
    setSearchParams(params);
  };

  const buildQuery = (filters: SearchFilters, page: number, sort: string) => {
    let query = supabase
      .from('theses')
      .select(`
        id,
        title,
        author,
        adviser,
        abstract,
        keywords,
        publish_date,
        view_count,
        download_count,
        cover_image_url,
        colleges!inner(name)
      `, { count: 'exact' })
      .eq('status', 'approved');

    // Text search - search across multiple fields
    if (filters.query) {
      query = query.or(`title.ilike.%${filters.query}%,abstract.ilike.%${filters.query}%,author.ilike.%${filters.query}%,keywords.cs.{${filters.query}}`);
    }

    // Filters
    if (filters.college) {
      query = query.eq('college_id', filters.college);
    }

    if (filters.yearFrom) {
      query = query.gte('publish_date', `${filters.yearFrom}-01-01`);
    }

    if (filters.yearTo) {
      query = query.lte('publish_date', `${filters.yearTo}-12-31`);
    }

    if (filters.author) {
      query = query.ilike('author', `%${filters.author}%`);
    }

    if (filters.adviser) {
      query = query.ilike('adviser', `%${filters.adviser}%`);
    }

    if (filters.keywords.length > 0) {
      // Search for any of the keywords
      const keywordConditions = filters.keywords.map(keyword => `keywords.cs.{${keyword}}`).join(',');
      query = query.or(keywordConditions);
    }

    // Sorting
    switch (sort) {
      case 'date_desc':
        query = query.order('publish_date', { ascending: false });
        break;
      case 'date_asc':
        query = query.order('publish_date', { ascending: true });
        break;
      case 'title_asc':
        query = query.order('title', { ascending: true });
        break;
      case 'title_desc':
        query = query.order('title', { ascending: false });
        break;
      case 'views_desc':
        query = query.order('view_count', { ascending: false });
        break;
      case 'downloads_desc':
        query = query.order('download_count', { ascending: false });
        break;
      default: // relevance
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const from = (page - 1) * RESULTS_PER_PAGE;
    const to = from + RESULTS_PER_PAGE - 1;
    query = query.range(from, to);

    return query;
  };

  const performSearch = async (filters: SearchFilters, page: number = 1, sort: string = 'relevance') => {
    setIsLoading(true);
    
    try {
      const query = buildQuery(filters, page, sort);
      const { data, error, count } = await query;

      if (error) {
        console.error('Search error:', error);
        toast.error('Search failed. Please try again.');
        return;
      }

      // Transform data to match our interface
      const transformedResults: Thesis[] = (data || []).map((thesis: any) => ({
        ...thesis,
        college_name: thesis.colleges?.name
      }));

      setResults(transformedResults);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / RESULTS_PER_PAGE));

      // Log search event
      await logEvent({
        action: 'advanced_search_performed',
        resourceType: 'search',
        details: {
          query: filters.query,
          filters: filters,
          results_count: count || 0,
          page,
          sort
        }
      });

      // Generate facets
      await generateFacets(filters);

    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFacets = async (filters: SearchFilters) => {
    try {
      // Get college facets
      const collegeQuery = supabase
        .from('theses')
        .select(`
          college_id,
          colleges!inner(name)
        `)
        .eq('status', 'approved');

      if (filters.query) {
        collegeQuery.or(`title.ilike.%${filters.query}%,abstract.ilike.%${filters.query}%,author.ilike.%${filters.query}%`);
      }

      const { data: collegeData } = await collegeQuery;
      
      const collegeCounts = collegeData?.reduce((acc: Record<string, { name: string; count: number }>, thesis: any) => {
        const collegeId = thesis.college_id;
        const collegeName = thesis.colleges?.name;
        if (!acc[collegeId]) {
          acc[collegeId] = { name: collegeName, count: 0 };
        }
        acc[collegeId].count++;
        return acc;
      }, {}) || {};

      const collegeFacets: Facet[] = Object.entries(collegeCounts)
        .map(([id, data]) => ({
          label: data.name,
          count: data.count,
          value: id
        }))
        .sort((a, b) => b.count - a.count);

      // Get year facets
      const yearQuery = supabase
        .from('theses')
        .select('publish_date')
        .eq('status', 'approved')
        .not('publish_date', 'is', null);

      if (filters.query) {
        yearQuery.or(`title.ilike.%${filters.query}%,abstract.ilike.%${filters.query}%,author.ilike.%${filters.query}%`);
      }

      const { data: yearData } = await yearQuery;
      
      const yearCounts = yearData?.reduce((acc: Record<string, number>, thesis: any) => {
        const year = new Date(thesis.publish_date).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {}) || {};

      const yearFacets: Facet[] = Object.entries(yearCounts)
        .map(([year, count]) => ({
          label: year,
          count: count,
          value: year
        }))
        .sort((a, b) => b.label.localeCompare(a.label));

      // Get author facets
      const authorQuery = supabase
        .from('theses')
        .select('author')
        .eq('status', 'approved');

      if (filters.query) {
        authorQuery.or(`title.ilike.%${filters.query}%,abstract.ilike.%${filters.query}%,author.ilike.%${filters.query}%`);
      }

      const { data: authorData } = await authorQuery;
      
      const authorCounts = authorData?.reduce((acc: Record<string, number>, thesis: any) => {
        const author = thesis.author;
        acc[author] = (acc[author] || 0) + 1;
        return acc;
      }, {}) || {};

      const authorFacets: Facet[] = Object.entries(authorCounts)
        .map(([author, count]) => ({
          label: author,
          count: count,
          value: author
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Limit to top 20 authors

      setFacets({
        colleges: collegeFacets,
        years: yearFacets,
        authors: authorFacets
      });

    } catch (error) {
      console.error('Error generating facets:', error);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    updateUrlParams(filters);
    setCurrentPage(1);
    performSearch(filters, 1, sortBy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const filters = getFiltersFromParams();
    performSearch(filters, page, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const filters = getFiltersFromParams();
    performSearch(filters, currentPage, sort);
  };

  const handleFacetFilter = (type: string, value: string) => {
    const currentFilters = getFiltersFromParams();
    let newFilters = { ...currentFilters };

    switch (type) {
      case 'college':
        newFilters.college = newFilters.college === value ? '' : value;
        break;
      case 'year':
        newFilters.yearFrom = newFilters.yearFrom === value ? '' : value;
        newFilters.yearTo = newFilters.yearTo === value ? '' : value;
        break;
      case 'author':
        newFilters.author = newFilters.author === value ? '' : value;
        break;
    }

    handleSearch(newFilters);
  };

  const handleViewThesis = (thesis: Thesis) => {
    navigate(`/thesis/${thesis.id}`);
  };

  // Perform initial search if there are URL parameters
  useEffect(() => {
    const filters = getFiltersFromParams();
    if (filters.query || filters.college || filters.yearFrom || filters.author) {
      performSearch(filters, 1, sortBy);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
          <p className="text-gray-600">
            Search and discover theses with powerful filtering options
          </p>
        </div>

        <div className="space-y-8">
          <AdvancedSearchInterface
            onSearch={handleSearch}
            colleges={colleges || []}
            isLoading={isLoading}
          />

          {(results.length > 0 || isLoading) && (
            <SearchResultsGrid
              results={results}
              totalCount={totalCount}
              isLoading={isLoading}
              facets={facets}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              onFacetFilter={handleFacetFilter}
              onViewThesis={handleViewThesis}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
