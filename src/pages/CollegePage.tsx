
import React, { useState, useMemo, useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CollegeCard from '@/components/CollegeCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FacetFilterBar, { FacetFilterState } from "@/components/FacetFilterBar";
import SearchInterface from "@/components/SearchInterface";
import { useTheses } from "@/hooks/useApi";
import type { Thesis } from "@/types/thesis";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const defaultFilters: FacetFilterState = {
  authors: [],
  years: [],
  colleges: [],
  statuses: [],
};

const CollegePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setCollege(data || null);
        setLoading(false);
      });
  }, [id]);

  // Get theses for this college
  const { data: theses = [] } = useTheses();
  const thesesArray: Thesis[] = Array.isArray(theses) ? theses : [];
  const thesesForCollege = thesesArray.filter((t) => t.college === id);

  // Set up filters
  const [filters, setFilters] = useState<FacetFilterState>(defaultFilters);

  // Unique authors and years belonging to this college only
  const allAuthors = useMemo(() => {
    const s = new Set<string>();
    thesesForCollege.forEach((t) => t.author && s.add(t.author));
    return Array.from(s).sort();
  }, [thesesForCollege]);

  const allYears = useMemo(() => {
    const s = new Set<string>();
    thesesForCollege.forEach((t) => {
      if (t.publishDate) {
        const year = new Date(t.publishDate).getFullYear();
        if (!isNaN(year)) {
          s.add(year.toString());
        }
      }
    });
    return Array.from(s).sort((a, b) => Number(b) - Number(a));
  }, [thesesForCollege]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Button variant="ghost" onClick={() => navigate('/collections')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Collections
                  </Button>
                </div>
                {loading ? (
                  <h1 className="text-4xl font-bold text-gray-900">Loading...</h1>
                ) : college ? (
                  <h1 className="text-4xl font-bold text-gray-900">{college.name}</h1>
                ) : (
                  <h1 className="text-4xl font-bold text-gray-900">College Not Found</h1>
                )}
                <p className="text-xl text-gray-600">Explore research papers and theses from {college?.name}</p>
              </div>
            </div>
          </div>
          {/* Faceted Filters for college-specific theses */}
          <div className="max-w-5xl mx-auto pt-8">
            <FacetFilterBar
              filters={filters}
              allYears={allYears}
              allAuthors={allAuthors}
              onFilterChange={setFilters}
            />
            <SearchInterface filters={filters} />
          </div>
          {/* College Details */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading college details...</div>
          ) : college ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {college.name}</h2>
                <p className="text-gray-700 leading-relaxed">{college.description}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-gray-400">College not found.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollegePage;
