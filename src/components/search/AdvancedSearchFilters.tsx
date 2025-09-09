import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, X, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useCollegesWithCounts } from '@/hooks/useCollegesWithCounts';

interface SearchFilters {
  colleges?: string[];
  programs?: string[];
  keywords?: string[];
  authors?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
}

interface Props {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export const AdvancedSearchFilters: React.FC<Props> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { data: colleges = [] } = useCollegesWithCounts();
  const [keywordInput, setKeywordInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const addKeyword = () => {
    if (keywordInput.trim() && !filters.keywords?.includes(keywordInput.trim())) {
      onFiltersChange({
        ...filters,
        keywords: [...(filters.keywords || []), keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onFiltersChange({
      ...filters,
      keywords: filters.keywords?.filter(k => k !== keyword)
    });
  };

  const addAuthor = () => {
    if (authorInput.trim() && !filters.authors?.includes(authorInput.trim())) {
      onFiltersChange({
        ...filters,
        authors: [...(filters.authors || []), authorInput.trim()]
      });
      setAuthorInput('');
    }
  };

  const removeAuthor = (author: string) => {
    onFiltersChange({
      ...filters,
      authors: filters.authors?.filter(a => a !== author)
    });
  };

  const toggleCollege = (collegeId: string) => {
    const currentColleges = filters.colleges || [];
    const updatedColleges = currentColleges.includes(collegeId)
      ? currentColleges.filter(id => id !== collegeId)
      : [...currentColleges, collegeId];
    
    onFiltersChange({
      ...filters,
      colleges: updatedColleges
    });
  };

  const updateDateRange = () => {
    onFiltersChange({
      ...filters,
      dateRange: {
        start: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        end: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      }
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : filter
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Colleges */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Colleges</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {colleges.map((college) => (
              <Button
                key={college.id}
                variant={filters.colleges?.includes(college.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCollege(college.id)}
                className="justify-between"
              >
                <span className="truncate">{college.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {college.thesesCount}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Keywords */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Keywords</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button onClick={addKeyword} variant="outline">
              Add
            </Button>
          </div>
          {filters.keywords && filters.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Authors */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Authors</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add author..."
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAuthor()}
            />
            <Button onClick={addAuthor} variant="outline">
              Add
            </Button>
          </div>
          {filters.authors && filters.authors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.authors.map((author) => (
                <Badge key={author} variant="secondary" className="gap-1">
                  {author}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeAuthor(author)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Publication Date Range</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Start date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'End date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {(startDate || endDate) && (
            <Button
              onClick={updateDateRange}
              size="sm"
              className="w-full"
            >
              Apply Date Range
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};