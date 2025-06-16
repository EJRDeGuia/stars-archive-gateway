
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ThesisManagementService } from '@/services/thesisManagement';

interface CollectionSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (collectionId: string) => void;
  selectedCount: number;
}

const CollectionSelectionDialog: React.FC<CollectionSelectionDialogProps> = ({
  open,
  onClose,
  onConfirm,
  selectedCount
}) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCollections();
    }
  }, [open]);

  const loadCollections = async () => {
    setLoading(true);
    const result = await ThesisManagementService.getCollections();
    if (result.success) {
      setCollections(result.data);
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    if (selectedCollection) {
      onConfirm(selectedCollection);
      setSelectedCollection('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Move {selectedCount} theses to collection
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select 
            value={selectedCollection} 
            onValueChange={setSelectedCollection}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!selectedCollection || loading}
          >
            Move to Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionSelectionDialog;
