
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, Sparkles, Loader, User, Bot, Lightbulb, Save, FolderOpen, Trash2 } from 'lucide-react';
import { semanticSearchService } from '@/services/semanticSearch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/contexts/AuthContext";
import { useSaveSearch, useSavedConversations, useSaveConversation, useUpdateConversation, useDeleteConversation } from "@/hooks/useApi";
import SaveSearchModal from "./SaveSearchModal";
import SaveConversationModal from "./SaveConversationModal";
import LoadConversationModal from "./LoadConversationModal";
import { useNavigate } from 'react-router-dom';

type Thesis = {
  id: string;
  title: string;
  author: string;
  year: number;
  college: string;
  abstract: string;
  keywords: string[];
};

type ChatItem = {
  type: 'user' | 'result' | 'error';
  query?: string;
  results?: Thesis[];
  error?: string;
  suggestions?: Thesis[];
};

type ChatSearchProps = {
  filters?: any;
};

const quickSuggestions = [
  "Recent AI research in this college",
  "Best thesis awards 2024",
  "List projects on business analytics",
  "Faculty-authored theses",
  "Most cited papers",
];

const ChatSearch: React.FC<ChatSearchProps> = ({ filters }) => {
  const [chat, setChat] = useState<ChatItem[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSaveConversationModal, setShowSaveConversationModal] = useState(false);
  const [showLoadConversationModal, setShowLoadConversationModal] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentConversationName, setCurrentConversationName] = useState<string>("");
  
  const saveSearch = useSaveSearch();
  const saveConversation = useSaveConversation();
  const updateConversation = useUpdateConversation();
  const navigate = useNavigate();

  // TRACK THE LAST SEARCH RESULT for improved control
  const lastResult = chat
    .slice()
    .reverse()
    .find(item => item.type === 'result' || (item.type === "error" && item.query));

  // Only show the Save Search button and modal after successful search with results
  const userCanSaveSearch =
    !!user &&
    !!lastResult &&
    lastResult.type === 'result' &&
    Array.isArray(lastResult.results) &&
    lastResult.results.length > 0 &&
    !showSaveModal; // Don't show button if modal is already open

  // Auto-save conversation when chat changes (if conversation exists)
  useEffect(() => {
    if (currentConversationId && chat.length > 0 && user?.id) {
      const saveTimer = setTimeout(() => {
        updateConversation.mutate({
          id: currentConversationId,
          conversation: chat,
        });
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(saveTimer);
    }
  }, [chat, currentConversationId, user?.id, updateConversation]);

  // Conversation management handlers
  const handleSaveConversation = (name: string) => {
    if (user?.id && chat.length > 0) {
      if (currentConversationId) {
        // Update existing conversation
        updateConversation.mutate({
          id: currentConversationId,
          conversation: chat,
        });
        setCurrentConversationName(name);
        toast({
          title: "Conversation Updated",
          description: `Updated "${name}" successfully.`,
        });
      } else {
        // Save new conversation
        saveConversation.mutate({
          userId: user.id,
          name,
          conversation: chat,
        }, {
          onSuccess: (data) => {
            setCurrentConversationId(data.id);
            setCurrentConversationName(name);
            toast({
              title: "Conversation Saved",
              description: `Saved "${name}" to your dashboard.`,
            });
          },
        });
      }
      setShowSaveConversationModal(false);
    }
  };

  const handleLoadConversation = (conversationData: any) => {
    // Load the conversation data into the chat
    setChat(conversationData.conversation_data || []);
    setCurrentConversationId(conversationData.id);
    setCurrentConversationName(conversationData.name);
    setShowLoadConversationModal(false);
    toast({
      title: "Conversation Loaded",
      description: `Loaded "${conversationData.name}" successfully.`,
    });
  };

  const handleClearConversation = () => {
    setChat([]);
    setCurrentConversationId(null);
    setCurrentConversationName("");
    toast({
      title: "Conversation Cleared",
      description: "Started a new conversation.",
    });
  };

  // Animate visibility of Save Search button
  useEffect(() => {
    // If chat has no usable search, close the modal
    if ((!lastResult || !userCanSaveSearch) && showSaveModal) {
      setShowSaveModal(false);
    }
  }, [lastResult, userCanSaveSearch, showSaveModal]);

  // Scroll to bottom on new chat
  useEffect(() => {
    chatEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // Find related theses for the top result using its title or keywords
  const fetchRelatedTheses = async (mainResult: Thesis) => {
    // Use the title plus keywords for secondary semantic search, excluding the thesis itself
    let relatedQuery = mainResult.title;
    if (mainResult.keywords && mainResult.keywords.length > 0) {
      relatedQuery += ' ' + mainResult.keywords.join(' ');
    }
    const related = await semanticSearchService.semanticSearch(relatedQuery, 5);
    // Filter out the thesis itself if it accidentally appears
    return related.filter(t => t.id !== mainResult.id);
  };

  // Fix: defensively check filter arrays
  useEffect(() => {
    if (
      filters &&
      (
        (filters.authors && filters.authors.length > 0) ||
        (filters.years && filters.years.length > 0) ||
        (filters.colleges && filters.colleges.length > 0) ||
        (filters.statuses && filters.statuses.length > 0)
      )
    ) {
      console.log('Applied filters:', filters);
    }
  }, [filters]);

  const handleSearch = async () => {
    const query = input.trim();
    if (!query) return;
    setChat((prev) => [...prev, { type: 'user', query }]);
    setIsLoading(true);
    setInput('');
    try {
      // Log query for debug
      console.log('[SemanticSearch] User query:', query);

      let results = await semanticSearchService.semanticSearch(query, 10);

      // Defensive Fallback: Try simple keyword filtering if semantic returns 0 results for "AI" etc.
      if (
        results.length === 0 &&
        query.toLowerCase().includes('ai')
      ) {
        results = (await semanticSearchService.semanticSearch('artificial intelligence', 10)).filter(
          t =>
            t.title?.toLowerCase().includes('ai') ||
            t.keywords?.some(k => k.toLowerCase().includes('ai')) ||
            t.abstract?.toLowerCase().includes('ai')
        );
        console.log('[SemanticSearch] Fallback hit for "AI", results:', results);
      }

      if (results.length === 0) {
        setChat((prev) => [
          ...prev,
          { type: 'result', results: [], query },
        ]);
        toast({
          title: 'No results found',
          description: 'Try another question or rephrase your search.',
          variant: 'destructive',
        });
      } else {
        // After main search: Fetch related suggestions for the top result
        let suggestions: Thesis[] = [];
        try {
          suggestions = results.length > 0 ? await fetchRelatedTheses(results[0]) : [];
        } catch (_) {
          suggestions = [];
        }

        setChat((prev) => [
          ...prev,
          { type: 'result', results, query, suggestions }
        ]);
      }
    } catch (e: any) {
      console.error(e);
      setChat((prev) => [
        ...prev,
        { type: 'error', error: e.message || 'Error searching.', query },
      ]);
      toast({ title: 'Error', description: String(e.message || e), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) handleSearch();
    }
  };

  // Add quick suggestion click handler
  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      // Optionally auto-submit suggestion, or just fill input for refinement:
      // handleSearch();
    }, 100);
  };

  // Save last query as "search"
  const handleSaveSearch = (name: string) => {
    if (user?.id && lastResult && lastResult.query) {
      saveSearch.mutate({
        userId: user.id,
        name,
        query: lastResult.query,
      });
      setShowSaveModal(false);
      toast({
        title: "Search Saved",
        description: `Saved "${name}" to your dashboard.`,
        variant: "default"
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto sleek-shadow-xl border-0 flex flex-col bg-white/95 overflow-hidden min-h-[580px] h-[70vh] animate-fade-in">
      {/* Header / Title */}
      <div className="p-6 border-b flex gap-3 items-center justify-between bg-gradient-to-r from-dlsl-green/10 to-white">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dlsl-green to-emerald-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Chat Research</h2>
            <p className="text-xs text-gray-500">
              {currentConversationName ? `Conversation: ${currentConversationName}` : "Ask about theses at De La Salle Lipa"}
            </p>
          </div>
        </div>
        
        {/* Conversation Management Buttons */}
        {user && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLoadConversationModal(true)}
              className="text-dlsl-green border-dlsl-green/30 hover:bg-dlsl-green/5"
              title="Load saved conversation"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Load
            </Button>
            
            {chat.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveConversationModal(true)}
                  className="text-dlsl-green border-dlsl-green/30 hover:bg-dlsl-green/5"
                  title="Save this conversation"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearConversation}
                  className="text-slate-500 border-slate-300 hover:bg-slate-50"
                  title="Clear conversation and start new"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Suggestions Bar - NEW */}
      <div className="flex flex-wrap gap-2 px-6 pt-3 pb-2 bg-slate-50/70 border-b">
        {quickSuggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSuggestion(s)}
            className="px-4 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500 hover:border-dlsl-green hover:text-dlsl-green transition-all duration-200 hover:shadow"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-slate-50/70">
        {chat.length === 0 && (
          <div className="flex flex-col items-center text-slate-400 mt-20 transition-all duration-150 animate-fade-in">
            <Sparkles className="w-10 h-10 mb-3" />
            <div className="text-xl font-semibold">Ask anything about research</div>
            <div className="text-md text-slate-400 mt-2">Type your question below – e.g. "Show me AI theses in 2023"</div>
          </div>
        )}
        {chat.map((item, idx) =>
          item.type === 'user' ? (
            <div key={idx} className="flex items-end justify-end">
              <div className="bg-dlsl-green text-white rounded-2xl px-4 py-3 max-w-[70%] flex flex-col shadow hover:scale-105 transition-transform">
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-2 text-white/80" />
                  <span className="text-xs">You</span>
                </div>
                <div className="whitespace-pre-line">{item.query}</div>
              </div>
            </div>
          ) : item.type === 'result' ? (
            <div key={idx} className="flex flex-col items-start justify-start">
              <div className="bg-white border border-dlsl-green/25 rounded-2xl px-4 py-3 max-w-[75%] flex flex-col shadow group hover:border-dlsl-green transition-all mb-2">
                <div className="flex items-center mb-1">
                  <Bot className="h-4 w-4 mr-2 text-dlsl-green" />
                  <span className="text-xs text-dlsl-green font-medium">STARS AI</span>
                </div>
                {item.results?.length === 0 ? (
                  <div className="italic text-slate-400 text-sm">No results found for "{item.query}"</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {item.results!.slice(0, 3).map((thesis, tidx) => (
                      <div 
                        key={tidx} 
                        className="border border-slate-100 rounded-lg p-3 bg-slate-50 hover:bg-dlsl-green/5 transition-all cursor-pointer hover:shadow-md hover:border-dlsl-green/30"
                        onClick={() => navigate(`/thesis/${thesis.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/thesis/${thesis.id}`);
                          }
                        }}
                      >
                        <div className="font-bold text-dlsl-green text-md mb-0.5 hover:underline">{thesis.title}</div>
                        <div className="text-xs text-slate-500 mb-0.5">{thesis.author} • {thesis.year} • <span className="">{thesis.college}</span></div>
                        <div className="text-slate-700 text-sm mb-1">{thesis.abstract?.substring(0, 100)}...</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {thesis.keywords?.slice(0, 3).map((k, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-dlsl-green/10 text-xs text-dlsl-green">{k}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {item.results!.length > 3 && (
                      <div className="text-xs mt-2 text-dlsl-green underline cursor-pointer">
                        +{item.results!.length - 3} more results
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Suggestions/Related Theses */}
              {item.suggestions && item.suggestions.length > 0 && (
                <div className="bg-dlsl-green/5 border border-dlsl-green/15 rounded-xl px-4 py-2 mt-1 max-w-[75%]">
                  <div className="flex items-center mb-1 gap-1">
                    <Lightbulb className="h-4 w-4 text-dlsl-green mr-1" />
                    <span className="text-xs text-dlsl-green font-semibold uppercase tracking-wider">Related Theses</span>
                  </div>
                  <ul className="space-y-1">
                    {item.suggestions.map((s, sidx) => (
                      <li 
                        key={sidx} 
                        className="text-sm text-dlsl-green/90 hover:underline cursor-pointer p-1 rounded hover:bg-dlsl-green/10 transition-colors"
                        onClick={() => navigate(`/thesis/${s.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/thesis/${s.id}`);
                          }
                        }}
                      >
                        {s.title}
                        <span className="text-xs text-slate-500 ml-2">
                          ({s.author}, {s.year})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div key={idx} className="flex items-end justify-start">
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 max-w-[75%] flex flex-col shadow">
                <div className="flex items-center mb-1">
                  <Bot className="h-4 w-4 mr-2 text-red-400" />
                  <span className="text-xs text-red-500 font-medium">STARS AI</span>
                </div>
                <div className="text-red-500">{item.error}</div>
              </div>
            </div>
          )
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={e => { e.preventDefault(); handleSearch(); }}
        className="p-5 bg-white border-t border-slate-100 flex items-center gap-3"
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your research question and press Enter..."
          className="flex-1 border rounded-xl p-3 resize-none text-md focus:ring-2 focus:ring-dlsl-green focus:outline-none bg-slate-50 min-h-[44px] max-h-32"
          rows={1}
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="bg-dlsl-green hover:bg-dlsl-green-dark text-white rounded-xl px-5 py-2 shadow-lg transition disabled:opacity-40"
          disabled={isLoading || !input.trim()}
        >
          {isLoading
            ? <Loader className="animate-spin h-5 w-5" />
            : <Send className="h-5 w-5" />}
        </Button>
        {/* Improved Save Search Button - only show after actual result */}
        {userCanSaveSearch && (
          <Button
            type="button"
            variant="outline"
            className="ml-4 text-dlsl-green border-dlsl-green/30 px-3 font-semibold animate-fade-in"
            onClick={() => setShowSaveModal(true)}
            tabIndex={0}
            title="Save this search to your dashboard for quick access"
            aria-label="Save this search"
          >
            Save Search
          </Button>
        )}
      </form>
      {/* SaveSearchModal - show only when modal state is true */}
      <SaveSearchModal 
        open={showSaveModal} 
        onClose={() => setShowSaveModal(false)} 
        onSave={handleSaveSearch}
        defaultName={lastResult?.query ? lastResult.query.slice(0, 32) : "Research Query"}
        autoFocus
      />
      
      {/* Conversation Management Modals */}
      <SaveConversationModal
        open={showSaveConversationModal}
        onClose={() => setShowSaveConversationModal(false)}
        onSave={handleSaveConversation}
        defaultName={currentConversationName || (lastResult?.query ? `Chat: ${lastResult.query.slice(0, 20)}...` : "New Chat")}
        autoFocus
      />
      
      <LoadConversationModal
        open={showLoadConversationModal}
        onClose={() => setShowLoadConversationModal(false)}
        onLoad={handleLoadConversation}
      />
    </Card>
  );
};

export default ChatSearch;
