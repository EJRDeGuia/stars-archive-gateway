
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Send, 
  Sparkles, 
  Clock, 
  BookOpen, 
  User,
  Calendar,
  FileText,
  ArrowRight
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { semanticSearchService } from '@/services/semanticSearch';
import { useNavigate } from 'react-router-dom';

interface Thesis {
  id: string;
  title: string;
  author: string;
  year: number;
  college: string;
  abstract: string;
  keywords: string[];
}

interface SearchInterfaceProps {
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch, className = "" }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<Thesis[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'semantic' | 'keyword'>('keyword');

  const recentSearches = [
    "Machine Learning in Healthcare",
    "Sustainable Tourism Practices",
    "Business Analytics Tools",
    "Educational Technology Trends",
    "Digital Transformation"
  ];

  const suggestedTopics = [
    "Artificial Intelligence",
    "Blockchain Technology", 
    "Digital Marketing",
    "Environmental Science",
    "Nursing Research"
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchValue(query);
    
    try {
      let results: Thesis[] = [];
      
      if (searchMode === 'semantic') {
        const semanticResults = await semanticSearchService.semanticSearch(query, 10);
        results = semanticResults.map(result => result.thesis);
      } else {
        results = semanticSearchService.keywordSearch(query);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to keyword search
      const results = semanticSearchService.keywordSearch(query);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
    
    onSearch?.(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchValue);
    }
  };

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  return (
    <div className={`w-full ${className}`}>
      <Card className="sleek-shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-lg">
        {/* Header */}
        <div className="p-8 pb-6 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-dlsl-green via-dlsl-green-light to-emerald-400 rounded-2xl flex items-center justify-center sleek-shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Research Search</h2>
              <p className="text-slate-600 mt-1">Search theses by keywords, authors, or topics</p>
            </div>
          </div>
          
          {/* Search Mode Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={searchMode === 'semantic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('semantic')}
              className="text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Smart Search
            </Button>
            <Button
              variant={searchMode === 'keyword' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('keyword')}
              className="text-xs"
            >
              <Search className="w-3 h-3 mr-1" />
              Keyword
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-2xl border-2 border-slate-200/60 focus-within:border-dlsl-green focus-within:bg-white transition-all duration-300 sleek-shadow hover:sleek-shadow-lg group">
              <div className="pl-6">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-dlsl-green transition-colors" />
              </div>
              <input
                type="text"
                placeholder={searchMode === 'semantic' ? "Smart search: 'AI applications in education'..." : "Search by keywords: title, author, topic..."}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent px-4 py-5 text-lg text-slate-800 placeholder-slate-500 focus:outline-none"
              />
              <div className="pr-4">
                <Button 
                  size="sm" 
                  onClick={() => handleSearch(searchValue)}
                  disabled={isSearching}
                  className="bg-dlsl-green hover:bg-dlsl-green-dark text-white rounded-xl px-6 py-3 sleek-shadow-lg hover:sleek-shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-dlsl-green" />
              Search Results ({searchResults.length})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {searchResults.map((thesis) => (
                <Card 
                  key={thesis.id} 
                  className="bg-white sleek-shadow hover:sleek-shadow-lg transition-all duration-200 border-0 cursor-pointer group"
                  onClick={() => handleThesisClick(thesis.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-slate-900 text-lg leading-tight group-hover:text-dlsl-green transition-colors">
                        {thesis.title}
                      </h4>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-dlsl-green transition-colors flex-shrink-0 ml-4" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {thesis.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {thesis.year}
                      </div>
                      <div className="px-2 py-1 bg-dlsl-green/10 text-dlsl-green rounded-full text-xs font-medium">
                        {thesis.college}
                      </div>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed mb-3">
                      {thesis.abstract.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {thesis.keywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                          {keyword}
                        </span>
                      ))}
                      {thesis.keywords.length > 3 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
                          +{thesis.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className="border-t border-slate-100 bg-slate-50/30">
          <Command className="bg-transparent border-0">
            <CommandList className="max-h-80">
              <CommandEmpty className="py-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-700">No results found</p>
                    <p className="text-sm text-slate-500 mt-1">Try different keywords or browse suggestions below</p>
                  </div>
                </div>
              </CommandEmpty>
              
              <CommandGroup heading="🕒 Recent Searches" className="px-6 py-3">
                {recentSearches.map((search, index) => (
                  <CommandItem 
                    key={index} 
                    className="flex items-center space-x-4 py-3 px-4 rounded-xl hover:bg-white transition-colors cursor-pointer sleek-shadow-sm hover:sleek-shadow"
                    onSelect={() => handleSearch(search)}
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-slate-500" />
                    </div>
                    <span className="text-slate-700 font-medium">{search}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandGroup heading="💡 Suggested Topics" className="px-6 py-3">
                {suggestedTopics.map((topic, index) => (
                  <CommandItem 
                    key={index} 
                    className="flex items-center space-x-4 py-3 px-4 rounded-xl hover:bg-white transition-colors cursor-pointer sleek-shadow-sm hover:sleek-shadow"
                    onSelect={() => handleSearch(topic)}
                  >
                    <div className="w-8 h-8 bg-dlsl-green/10 rounded-full flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-dlsl-green" />
                    </div>
                    <span className="text-slate-700 font-medium">{topic}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Card>
    </div>
  );
};

export default SearchInterface;
