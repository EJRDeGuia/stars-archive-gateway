
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter, Calendar, User, Building, BookOpen } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

interface AdvancedSearchInterfaceProps {
  onSearch: (filters: SearchFilters) => void;
  colleges: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

const AdvancedSearchInterface: React.FC<AdvancedSearchInterfaceProps> = ({
  onSearch,
  colleges = [],
  isLoading = false
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    college: '',
    yearFrom: '',
    yearTo: '',
    author: '',
    adviser: '',
    keywords: [],
    status: 'approved'
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      college: '',
      yearFrom: '',
      yearTo: '',
      author: '',
      adviser: '',
      keywords: [],
      status: 'approved'
    });
    setKeywordInput('');
  };

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !filters.keywords.includes(keyword.trim())) {
      setFilters(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFilters(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(keywordInput);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Advanced Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Search Query */}
          <div className="space-y-2">
            <Label htmlFor="main-search">Search Terms</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="main-search"
                placeholder="Enter title, abstract, or keywords..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>College</Label>
              <Select value={filters.college} onValueChange={(value) => setFilters(prev => ({ ...prev, college: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All colleges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All colleges</SelectItem>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year From</Label>
              <Select value={filters.yearFrom} onValueChange={(value) => setFilters(prev => ({ ...prev, yearFrom: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any year</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year To</Label>
              <Select value={filters.yearTo} onValueChange={(value) => setFilters(prev => ({ ...prev, yearTo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any year</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Expandable Advanced Filters */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </span>
                <span className="text-xs text-gray-500">
                  {isExpanded ? 'Hide' : 'Show'}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author-search">Author</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="author-search"
                      placeholder="Author name..."
                      value={filters.author}
                      onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adviser-search">Adviser</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="adviser-search"
                      placeholder="Adviser name..."
                      value={filters.adviser}
                      onChange={(e) => setFilters(prev => ({ ...prev, adviser: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords-input">Keywords</Label>
                <div className="space-y-2">
                  <Input
                    id="keywords-input"
                    placeholder="Type keyword and press Enter..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={handleKeywordKeyPress}
                  />
                  {filters.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {filters.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {keyword}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => removeKeyword(keyword)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSearch} disabled={isLoading} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>

          {/* Active Filters Summary */}
          {(filters.query || filters.college || filters.yearFrom || filters.yearTo || filters.author || filters.adviser || filters.keywords.length > 0) && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {filters.query && (
                  <Badge variant="outline">Query: "{filters.query}"</Badge>
                )}
                {filters.college && colleges.find(c => c.id === filters.college) && (
                  <Badge variant="outline">
                    <Building className="w-3 h-3 mr-1" />
                    {colleges.find(c => c.id === filters.college)?.name}
                  </Badge>
                )}
                {filters.yearFrom && (
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    From: {filters.yearFrom}
                  </Badge>
                )}
                {filters.yearTo && (
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    To: {filters.yearTo}
                  </Badge>
                )}
                {filters.author && (
                  <Badge variant="outline">
                    <User className="w-3 h-3 mr-1" />
                    Author: {filters.author}
                  </Badge>
                )}
                {filters.adviser && (
                  <Badge variant="outline">
                    <User className="w-3 h-3 mr-1" />
                    Adviser: {filters.adviser}
                  </Badge>
                )}
                {filters.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearchInterface;
