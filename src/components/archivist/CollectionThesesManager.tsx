
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Search, Plus, Trash2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Thesis } from '@/types/thesis';

interface CollectionThesesManagerProps {
  collectionId: string;
  collectionName: string;
}

const CollectionThesesManager: React.FC<CollectionThesesManagerProps> = ({
  collectionId,
  collectionName
}) => {
  const [collectionTheses, setCollectionTheses] = useState<Thesis[]>([]);
  const [availableTheses, setAvailableTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheses, setSelectedTheses] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    fetchCollectionTheses();
    fetchAvailableTheses();
  }, [collectionId]);

  const fetchCollectionTheses = async () => {
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
            colleges (
              name
            )
          )
        `)
        .eq('collection_id', collectionId);

      if (error) throw error;

      const theses = data?.map(item => item.theses).filter(Boolean) as Thesis[];
      setCollectionTheses(theses || []);
    } catch (error: any) {
      toast.error('Failed to fetch collection theses: ' + error.message);
    }
  };

  const fetchAvailableTheses = async () => {
    setLoading(true);
    try {
      // Fetch all approved theses
      const { data: allTheses, error: thesesError } = await supabase
        .from('theses')
        .select(`
          *,
          colleges (
            name
          )
        `)
        .eq('status', 'approved');

      if (thesesError) throw thesesError;

      // Fetch theses already in this collection
      const { data: collectionThesesData, error: collectionError } = await supabase
        .from('collection_theses')
        .select('thesis_id')
        .eq('collection_id', collectionId);

      if (collectionError) throw collectionError;

      const collectionThesesIds = new Set(
        collectionThesesData?.map(item => item.thesis_id) || []
      );

      // Filter out theses already in collection
      const available = (allTheses || []).filter(
        thesis => !collectionThesesIds.has(thesis.id)
      );

      setAvailableTheses(available);
    } catch (error: any) {
      toast.error('Failed to fetch available theses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTheses = async () => {
    if (selectedTheses.length === 0) {
      toast.error('Please select at least one thesis');
      return;
    }

    try {
      const insertData = selectedTheses.map(thesisId => ({
        collection_id: collectionId,
        thesis_id: thesisId,
      }));

      const { error } = await supabase
        .from('collection_theses')
        .insert(insertData);

      if (error) throw error;

      toast.success(`Added ${selectedTheses.length} theses to collection`);
      setSelectedTheses([]);
      setIsAddDialogOpen(false);
      fetchCollectionTheses();
      fetchAvailableTheses();
    } catch (error: any) {
      toast.error('Failed to add theses: ' + error.message);
    }
  };

  const handleRemoveThesis = async (thesisId: string) => {
    if (!confirm('Are you sure you want to remove this thesis from the collection?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('collection_theses')
        .delete()
        .eq('collection_id', collectionId)
        .eq('thesis_id', thesisId);

      if (error) throw error;

      toast.success('Thesis removed from collection');
      fetchCollectionTheses();
      fetchAvailableTheses();
    } catch (error: any) {
      toast.error('Failed to remove thesis: ' + error.message);
    }
  };

  const filteredAvailableTheses = availableTheses.filter(thesis =>
    thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thesis.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Theses in "{collectionName}"
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-dlsl-green hover:bg-dlsl-green/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Theses
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Add Theses to Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search available theses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="max-h-96 overflow-y-auto border rounded">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedTheses.length === filteredAvailableTheses.length && filteredAvailableTheses.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTheses(filteredAvailableTheses.map(t => t.id));
                                } else {
                                  setSelectedTheses([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>College</TableHead>
                          <TableHead>Year</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              Loading available theses...
                            </TableCell>
                          </TableRow>
                        ) : filteredAvailableTheses.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No available theses found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAvailableTheses.map((thesis) => (
                            <TableRow key={thesis.id}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedTheses.includes(thesis.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedTheses(prev => [...prev, thesis.id]);
                                    } else {
                                      setSelectedTheses(prev => prev.filter(id => id !== thesis.id));
                                    }
                                  }}
                                />
                              </TableCell>
                              <TableCell className="font-medium max-w-xs truncate">
                                {thesis.title}
                              </TableCell>
                              <TableCell>{thesis.author}</TableCell>
                              <TableCell>{thesis.colleges?.name || 'Unknown'}</TableCell>
                              <TableCell>
                                {thesis.publish_date ? new Date(thesis.publish_date).getFullYear() : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedTheses.length} of {filteredAvailableTheses.length} theses selected
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddTheses} 
                    disabled={selectedTheses.length === 0}
                    className="bg-dlsl-green hover:bg-dlsl-green/90"
                  >
                    Add {selectedTheses.length} Theses
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {collectionTheses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No theses in this collection</h3>
              <p className="text-gray-500 mb-6">
                Start building your collection by adding relevant theses.
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-dlsl-green hover:bg-dlsl-green/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Theses
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionTheses.map((thesis) => (
                  <TableRow key={thesis.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={thesis.title}>
                        {thesis.title}
                      </div>
                    </TableCell>
                    <TableCell>{thesis.author}</TableCell>
                    <TableCell>{thesis.colleges?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      {thesis.publish_date ? new Date(thesis.publish_date).getFullYear() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={thesis.status === 'approved' ? 'default' : 'secondary'}>
                        {thesis.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveThesis(thesis.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionThesesManager;
