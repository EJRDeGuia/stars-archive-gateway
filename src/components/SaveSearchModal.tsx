
import { useEffect, useRef, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SaveSearchModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultName?: string;
  autoFocus?: boolean;
};

export default function SaveSearchModal({ open, onClose, onSave, defaultName, autoFocus }: SaveSearchModalProps) {
  const [name, setName] = useState(defaultName || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input whenever modal is opened and autoFocus is true
  useEffect(() => {
    if (open && autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, autoFocus]);

  // Reset name when modal is re-opened
  useEffect(() => {
    if (open && defaultName) {
      setName(defaultName);
    }
  }, [open, defaultName]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Save this Search</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Search name"
            ref={inputRef}
            className="mb-4"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-dlsl-green text-white" 
              disabled={!name.trim()}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
