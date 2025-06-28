
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoriteButton from '@/components/FavoriteButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  Eye,
  Calendar,
  User,
  Building,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserFavorites } from '@/hooks/useApi';
import type { Thesis } from '@/types/thesis';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  _count?: {
    collection_theses: number;
  };
}

const CollectionView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [filteredTheses, setFilteredTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'publish_date'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch user favorites
  const { data: userFavorites = [] } = useUserFavorites(user?.id);

  useEffect(() => {
    if (id) {
      fetchCollection();
      fetchCollectionTheses();
    }
  }, [id]);

  useEffect(() => {
    filterAndSortTheses();
  }, [theses, searchTerm, sortBy, sortOrder]);

  const fetchCollection = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Count theses in collection
      const { count } = await supabase
        .from('collection_theses')
        .select('*', { count: 'exact', head: true })
        .eq('collection_id', id);

      setCollection({
        ...data,
        _count: { collection_theses: count || 0 }
      });
    } catch (error: any) {
      console.error('Error fetching collection:', error);
      toast.error('Failed to load collection');
      navigate('/collections');
    }
  };

  const fetchCollectionTheses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collection_theses')
        .select(`
          thesis_id,
          theses (
            id,
            title,
            author,
            college_id,
            abstract,
            keywords,
            status,
            publish_date,
            adviser,
            co_adviser,
            cover_image_url,
            created_at,
            download_count,
            file_url,
            view_count,
            colleges (
              id,
              name,
              description
            )
          )
        `)
        .eq('collection_id', id);

      if (error) throw error;

      const thesesData = data?.map(item => item.theses).filter(Boolean) as Thesis[];
      setTheses(thesesData || []);
    } catch (error: any) {
      console.error('Error fetching collection theses:', error);
      toast.error('Failed to load theses');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTheses = () => {
    let filtered = theses.filter(thesis =>
      thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thesis.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thesis.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thesis.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sort theses
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'author':
          aValue = a.author;
          bValue = b.author;
          break;
        case 'publish_date':
          aValue = new Date(a.publish_date || '1900-01-01');
          bValue = new Date(b.publish_date || '1900-01-01');
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTheses(filtered);
  };

  const handleThesisClick = (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const getFavoriteId = (thesisId: string) => {
    return userFavorites?.find(fav => fav.thesis_id === thesisId)?.id;
  };

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading collection...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/collections')}
              className="mb-6 text-dlsl-green hover:bg-dlsl-green/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{collection.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {collection.description || 'A curated collection of academic research papers and theses.'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{collection._count?.collection_theses || 0} theses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {new Date(collection.created_at).toLocaleDateString()}</span>
                    </div>
                    <Badge variant={collection.is_public ? "default" : "secondary"}>
                      {collection.is_public ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search theses by title, author, abstract, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="author">Author</SelectItem>
                      <SelectItem value="publish_date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {searchTerm && (
                <div className="mt-3 text-sm text-gray-600">
                  Showing {filteredTheses.length} of {theses.length} theses
                </div>
              )}
            </CardContent>
          </Card>

          {/* Theses List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Theses in Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading theses...</p>
                </div>
              ) : filteredTheses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {searchTerm ? 'No matching theses found' : 'No theses in this collection'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Try adjusting your search terms.'
                      : 'This collection is empty.'
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Downloads</TableHead>
                        {user && <TableHead>Save</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTheses.map((thesis) => (
                        <TableRow 
                          key={thesis.id} 
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell 
                            className="font-medium max-w-xs"
                            onClick={() => handleThesisClick(thesis.id)}
                          >
                            <div className="space-y-1">
                              <div className="font-semibold text-dlsl-green hover:underline line-clamp-1">
                                {thesis.title}
                              </div>
                              {thesis.abstract && (
                                <div className="text-xs text-gray-500 line-clamp-2">
                                  {thesis.abstract}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell onClick={() => handleThesisClick(thesis.id)}>
                            <div className="space-y-1">
                              <div className="font-medium">{thesis.author}</div>
                              {thesis.adviser && (
                                <div className="text-xs text-gray-500">
                                  Adviser: {thesis.adviser}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell onClick={() => handleThesisClick(thesis.id)}>
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{thesis.colleges?.name || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell onClick={() => handleThesisClick(thesis.id)}>
                            {thesis.publish_date ? new Date(thesis.publish_date).getFullYear() : 'N/A'}
                          </TableCell>
                          <TableCell onClick={() => handleThesisClick(thesis.id)}>
                            <Badge 
                              variant={thesis.status === 'approved' ? 'default' : 'secondary'}
                              className={thesis.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {thesis.status}
                            </Badge>
                          </TableCell>
                          <TableCell onClick={() => handleThesisClick(thesis.id)}>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Eye className="w-3 h-3" />
                              {thesis.view_count || 0}
                            </div>
                          </TableCell>
                          <TableCell onClick={() => handleThesisClick(thesis.id)}>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Download className="w-3 h-3" />
                              {thesis.download_count || 0}
                            </div>
                          </TableCell>
                          {user && (
                            <TableCell>
                              <FavoriteButton
                                userId={user.id}
                                thesisId={thesis.id}
                                favoriteId={getFavoriteId(thesis.id)}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionView;
