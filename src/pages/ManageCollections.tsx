
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
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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

const ManageCollections = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_public: true,
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_theses(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Count theses for each collection
      const collectionsWithCounts = await Promise.all(
        (data || []).map(async (collection) => {
          const { count } = await supabase
            .from('collection_theses')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', collection.id);

          return {
            ...collection,
            _count: { collection_theses: count || 0 }
          };
        })
      );

      setCollections(collectionsWithCounts);
    } catch (error: any) {
      toast.error('Failed to fetch collections: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create collections');
      return;
    }

    try {
      console.log('Creating collection with user ID:', user.id);
      
      const { error } = await supabase
        .from('collections')
        .insert([{
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public,
          created_by: user.id,
        }]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast.success('Collection created successfully');
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', is_public: true });
      fetchCollections();
    } catch (error: any) {
      console.error('Failed to create collection:', error);
      toast.error('Failed to create collection: ' + error.message);
    }
  };

  const handleUpdateCollection = async () => {
    if (!editingCollection || !formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('collections')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          is_public: formData.is_public,
        })
        .eq('id', editingCollection.id);

      if (error) throw error;

      toast.success('Collection updated successfully');
      setEditingCollection(null);
      setFormData({ name: '', description: '', is_public: true });
      fetchCollections();
    } catch (error: any) {
      toast.error('Failed to update collection: ' + error.message);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete collection_theses entries
      await supabase
        .from('collection_theses')
        .delete()
        .eq('collection_id', collectionId);

      // Then delete the collection
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      toast.success('Collection deleted successfully');
      fetchCollections();
    } catch (error: any) {
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

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'public' && collection.is_public) ||
                         (filterType === 'private' && !collection.is_public);

    return matchesSearch && matchesFilter;
  });

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
                      <label className="text-sm font-medium mb-2 block">Collection Name</label>
                      <Input
                        placeholder="Enter collection name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Enter collection description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
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
                        Make this collection public
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
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
                        <CardTitle className="text-lg mb-2">{collection.name}</CardTitle>
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
                        onClick={() => openEditDialog(collection)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCollection(collection.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Created {new Date(collection.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={!!editingCollection} onOpenChange={(open) => !open && setEditingCollection(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Collection Name</label>
                  <Input
                    placeholder="Enter collection name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    placeholder="Enter collection description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
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
                    Make this collection public
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingCollection(null)}>
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
