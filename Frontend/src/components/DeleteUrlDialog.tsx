import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { type Url } from '@/api/url';
import { AlertTriangle } from 'lucide-react';

interface DeleteUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: Url;
  onConfirm: () => void;
}

export const DeleteUrlDialog = ({
  open,
  onOpenChange,
  url,
  onConfirm,
}: DeleteUrlDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Delete URL</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-2">
            Are you sure you want to delete this URL?
          </p>
          <div className="bg-muted rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium">
              {url.title || 'Untitled URL'}
            </p>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {url.shortUrl}
            </p>
            <p className="text-xs text-muted-foreground break-all">
              {url.originalUrl}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            This will permanently delete the URL and all associated analytics
            data.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete URL'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

