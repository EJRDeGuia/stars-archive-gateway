import React from 'react';
import { useState } from 'react';
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
import ChatSearch from "./ChatSearch";

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
  filters?: any; // Accept filters from parent if provided
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  className = "",
  filters,
}) => {
  // Forward filters if needed in the future
  return (
    <div className={className}>
      <ChatSearch filters={filters} />
    </div>
  );
};

export default SearchInterface;
