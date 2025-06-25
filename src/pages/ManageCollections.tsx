
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit2,
  Trash2,
  FolderOpen,
  BookOpen,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Users,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import CollectionThesesManager from '@/components/archivist/CollectionThesesManager';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  _count?: {
    collection_theses: number;
  };
}

const ManageCollections = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
  });

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  const fetchCollections = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Fetching collections...');
      
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching collections:', error);
        throw error;
      }

      console.log('Fetched collections:', data);

      // Count theses for each collection
      const collectionsWithCounts = await Promise.all(
        (data || []).map(async (collection) => {
          const { count, error: countError } = await supabase
            .from('collection_theses')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          if (countError) {
            console.error('Error counting theses for collection:', collection.id, countError);
          }

          return {
            ...collection,
            _count: { collection_theses: count || 0 }
          };
        })
      );

      setCollections(collectionsWithCounts);
    } catch (error: any) {
      console.error('Failed to fetch collections:', error);
      toast.error('Failed to fetch collections: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return false;
    }
    if (formData.name.trim().length < 3) {
      toast.error('Collection name must be at least 3 characters long');
      return false;
    }
    return true;
  };

  const handleCreateCollection = async () => {
    if (!validateForm()) return;
    
    if (!user) {
      toast.error('You must be logged in to create collections');
      return;
    }

    try {
      console.log('Creating collection with data:', {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        is_public: formData.is_public,
        created_by: user.id,
      });
      
      const { data, error } = await supabase
        .from('collections')
        .insert([{
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating collection:', error);
        throw error;
      }

      console.log('Collection created successfully:', data);
      toast.success('Collection created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      await fetchCollections();
    } catch (error: any) {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection: ' + error.message);
    }
  };

  const handleUpdateCollection = async () => {
    if (!validateForm() || !editingCollection) return;

    try {
      const { data, error } = await supabase
        .from('collections')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingCollection.id)
        .select()
        .single();

      if (error) throw error;

      console.log('Collection updated successfully:', data);
      toast.success('Collection updated successfully!');
      setEditingCollection(null);
      resetForm();
      await fetchCollections();
    } catch (error: any) {
      console.error('Failed to update collection:', error);
      toast.error('Failed to update collection: ' + error.message);
    }
  };

  const handleDeleteCollection = async (collectionId: string, collectionName: string) => {
    const confirmed = confirm(`Are you sure you want to delete "${collectionName}"? This will also remove all theses from this collection. This action cannot be undone.`);
    
    if (!confirmed) return;

    try {
      // First delete collection_theses entries
      const { error: thesesError } = await supabase
        .from('collection_theses')
        .delete()
        .eq('collection_id', collectionId);

      if (thesesError) {
        console.error('Error deleting collection theses:', thesesError);
        throw thesesError;
      }

      // Then delete the collection
      const { error: collectionError } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      if (collectionError) {
        console.error('Error deleting collection:', collectionError);
        throw collectionError;
      }

      toast.success('Collection deleted successfully');
      await fetchCollections();
    } catch (error: any) {
      console.error('Failed to delete collection:', error);
      toast.error('Failed to delete collection: ' + error.message);
    }
  };

  const openEditDialog = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      is_public: collection.is_public,
    });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', is_public: true });
  };

  const handleManageTheses = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'public' && collection.is_public) ||
                         (filterType === 'private' && !collection.is_public);

    return matchesSearch && matchesFilter;
  });

  // If viewing a specific collection's theses
  if (selectedCollection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <Button 
              variant="ghost" 
              onClick={handleBackToCollections}
              className="mb-6 text-dlsl-green hover:bg-dlsl-green/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
            
            <CollectionThesesManager 
              collectionId={selectedCollection.id}
              collectionName={selectedCollection.name}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/archivist')}
              className="mb-6 text-dlsl-green hover:bg-dlsl-green/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Collections</h1>
                <p className="text-xl text-gray-600">
                  Create and organize research collections for better thesis discovery
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" />
                    {collections.length} Total Collections
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {collections.filter(c => c.is_public).length} Public
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {collections.filter(c => !c.is_public).length} Private
                  </span>
                </div>
              </div>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-dlsl-green hover:bg-dlsl-green/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Collection Name *</label>
                      <Input
                        placeholder="Enter collection name (min. 3 characters)"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Enter collection description (optional)"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_public"
                        checked={formData.is_public}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="is_public" className="text-sm font-medium">
                        Make this collection public (visible to all users)
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCollection} className="bg-dlsl-green hover:bg-dlsl-green/90">
                      Create Collection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search collections by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Collections</SelectItem>
                    <SelectItem value="public">Public Only</SelectItem>
                    <SelectItem value="private">Private Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Collections Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dlsl-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading collections...</p>
            </div>
          ) : filteredCollections.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No matching collections found' : 'No collections yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters.'
                    : 'Create your first collection to organize theses by themes or topics.'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-dlsl-green hover:bg-dlsl-green/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Collection
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-2">{collection.name}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={collection.is_public ? "default" : "secondary"}>
                            {collection.is_public ? 'Public' : 'Private'}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {collection._count?.collection_theses || 0} theses
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {collection.description || 'No description available.'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageTheses(collection)}
                        className="flex-1"
                      >
                        <BookOpen className="w-3 h-3 mr-1" />
                        Manage Theses
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(collection)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCollection(collection.id, collection.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Created {new Date(collection.created_at).toLocaleDateString()}
                      {collection.updated_at && collection.updated_at !== collection.created_at && (
                        <span> • Updated {new Date(collection.updated_at).toLocaleDateString()}</span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={!!editingCollection} onOpenChange={(open) => {
            if (!open) {
              setEditingCollection(null);
              resetForm();
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Collection Name *</label>
                  <Input
                    placeholder="Enter collection name (min. 3 characters)"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Enter collection description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="edit_is_public" className="text-sm font-medium">
                    Make this collection public (visible to all users)
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setEditingCollection(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateCollection} className="bg-dlsl-green hover:bg-dlsl-green/90">
                  Update Collection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageCollections;
