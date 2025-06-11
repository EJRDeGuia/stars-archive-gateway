
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <div className="mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1">
          <div className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What would you like to research today? Ask me anything..."
                className="border-0 text-lg placeholder-gray-400 focus:ring-0 focus:border-0 h-auto py-2 px-0 bg-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch();
                  }
                }}
              />
            </div>
            <Button 
              onClick={onSearch}
              className="bg-dlsl-green hover:bg-dlsl-green-dark text-white rounded-xl"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
