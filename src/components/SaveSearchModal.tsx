
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
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
      inputRef.current.focus();
    }
  }, [open, autoFocus]);

  // Reset name when modal is re-opened
  useEffect(() => {
    if (open && defaultName) {
      setName(defaultName);
    }
  }, [open, defaultName]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-[90]">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full relative">
          <h2 className="text-lg font-semibold mb-4">Save this Search</h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (name.trim()) onSave(name.trim());
            }}
          >
            <Input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Search name"
              autoFocus={false}
              ref={inputRef}
              className="mb-4"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-dlsl-green text-white" disabled={!name.trim()}>Save</Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
