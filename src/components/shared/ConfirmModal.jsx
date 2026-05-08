import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2 } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  confirmVariant = "default",
  requireReason = false,
  isLoading = false
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError('A reason is required to proceed.');
      return;
    }
    onConfirm(reason);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      
      {requireReason && (
        <DialogContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for action</label>
            <Textarea 
              placeholder="Provide a detailed reason..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              className={error ? 'border-rose-500 ring-rose-500/20' : ''}
            />
            {error && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        </DialogContent>
      )}

      <DialogFooter>
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          variant={confirmVariant === 'destructive' ? 'destructive' : 'default'}
          className={confirmVariant === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmModal;
