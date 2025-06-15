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
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  className = "",
}) => {
  // Remove any local search logic, always show ChatSearch
  return (
    <div className={className}>
      <ChatSearch />
    </div>
  );
};

export default SearchInterface;
