
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { XCircle } from 'lucide-react';

interface RejectNewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

const RejectNewsDialog = ({
  open,
  onOpenChange,
  rejectionReason,
  onReasonChange,
  onConfirm
}: RejectNewsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rejeter l'actualité</DialogTitle>
          <DialogDescription>
            Veuillez fournir un motif de rejet qui sera visible par l'auteur.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="rejection-reason" className="text-sm font-medium">
            Motif du rejet
          </Label>
          <Textarea 
            id="rejection-reason"
            value={rejectionReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Expliquez pourquoi cette actualité est rejetée..."
            className="mt-1.5 min-h-32"
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            <XCircle className="h-4 w-4 mr-1" />
            Rejeter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectNewsDialog;
