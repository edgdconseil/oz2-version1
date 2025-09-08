
import { NewsItem } from '@/types';
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
import { Input } from '@/components/ui/input';
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface AddImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNews: NewsItem | null;
  onSave: () => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
}

const AddImageDialog = ({
  open,
  onOpenChange,
  selectedNews,
  onSave,
  imageUrl,
  onImageUrlChange
}: AddImageDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une image à l'actualité</DialogTitle>
          <DialogDescription>
            Entrez l'URL de l'image que vous souhaitez ajouter à cette actualité.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="image-url" className="text-sm font-medium">
              URL de l'image
            </Label>
            <Input 
              id="image-url"
              value={imageUrl}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1.5"
            />
          </div>
          
          {imageUrl && (
            <div className="mt-4">
              <Label className="text-sm font-medium mb-2 block">
                Aperçu
              </Label>
              <div className="border rounded-md p-2 bg-gray-50 flex justify-center">
                <img 
                  src={imageUrl} 
                  alt="Aperçu" 
                  className="max-h-48 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x300?text=Image+invalide";
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave} disabled={!imageUrl.trim()}>
            <ImageIcon className="h-4 w-4 mr-1" />
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddImageDialog;
