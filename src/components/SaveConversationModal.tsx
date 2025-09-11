import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SaveConversationModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultName?: string;
  autoFocus?: boolean;
};

const SaveConversationModal: React.FC<SaveConversationModalProps> = ({
  open,
  onClose,
  onSave,
  defaultName = "New Conversation",
  autoFocus = false,
}) => {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && autoFocus && inputRef.current) {
      // Focus and select all text when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [open, autoFocus]);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      onSave(trimmedName);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-dlsl-green">Save Conversation</DialogTitle>
          <DialogDescription>
            Save this conversation to your dashboard for quick access later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="conversation-name" className="text-sm font-medium">
              Conversation Name
            </Label>
            <Input
              id="conversation-name"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter conversation name..."
              className="w-full"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="bg-dlsl-green hover:bg-dlsl-green-dark"
          >
            Save Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveConversationModal;