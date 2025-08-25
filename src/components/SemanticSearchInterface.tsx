
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Search, Sparkles, Brain, Zap, Info } from 'lucide-react';
import { useSemanticSearch, SemanticSearchResult } from '@/hooks/useSemanticSearch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SemanticSearchInterfaceProps {
  onResults: (results: SemanticSearchResult[]) => void;
  className?: string;
}

const SemanticSearchInterface: React.FC<SemanticSearchInterfaceProps> = ({
  onResults,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [matchThreshold, setMatchThreshold] = useState([0.7]);
  const [resultLimit, setResultLimit] = useState([20]);
  
  const { performSemanticSearch, isLoading } = useSemanticSearch();

  const handleSearch = async () => {
    if (!query.trim()) return;

    const results = await performSemanticSearch(
      query.trim(),
      resultLimit[0],
      matchThreshold[0]
    );
    
    onResults(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const exampleQueries = [
    "machine learning algorithms for prediction",
    "sustainable energy solutions",
    "educational technology in remote learning",
    "mental health in university students",
    "blockchain applications in finance"
  ];

  return (
    <TooltipProvider>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl">Semantic Search</span>
              <p className="text-sm text-gray-600 font-normal mt-1">
                AI-powered search that understands meaning and context
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Semantic search uses AI to find relevant theses based on meaning, 
                  not just keyword matching. Try natural language queries!
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Search Input */}
          <div className="space-y-2">
            <Label htmlFor="semantic-query">Describe what you're looking for</Label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-3 w-5 h-5 text-purple-500" />
              <Input
                id="semantic-query"
                placeholder="e.g., 'research about artificial intelligence in healthcare' or 'studies on climate change effects'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 py-6 text-base"
              />
            </div>
          </div>

          {/* Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                Similarity Threshold
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Higher values return more similar results. Lower values return more diverse results.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="space-y-2">
                <Slider
                  value={matchThreshold}
                  onValueChange={setMatchThreshold}
                  max={1}
                  min={0.5}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>More Diverse (0.5)</span>
                  <span className="font-medium">{matchThreshold[0].toFixed(2)}</span>
                  <span>More Similar (1.0)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Number of Results</Label>
              <div className="space-y-2">
                <Slider
                  value={resultLimit}
                  onValueChange={setResultLimit}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5</span>
                  <span className="font-medium">{resultLimit[0]} results</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !query.trim()}
            className="w-full py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Searching with AI...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-3" />
                Search Semantically
              </>
            )}
          </Button>

          {/* Example Queries */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-600">Try these example searches:</Label>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setQuery(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>AI Understanding</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Context Aware</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>Natural Language</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SemanticSearchInterface;
