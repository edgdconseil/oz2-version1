import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Family, CategoryType } from '@/types/category';
import { useToast } from '@/hooks/use-toast';

interface AddFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (family: Family) => void;
}

export const AddFamilyDialog = ({
  open,
  onOpenChange,
  onAdd,
}: AddFamilyDialogProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Alimentaire');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom de la famille est requis',
        variant: 'destructive',
      });
      return;
    }

    const newFamily: Family = {
      id: `FAM-${Date.now()}`,
      name: name.trim(),
      category,
    };

    onAdd(newFamily);
    toast({
      title: 'Famille ajoutée',
      description: `La famille "${name}" a été créée avec succès`,
    });

    // Reset form
    setName('');
    setCategory('Alimentaire');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une famille</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="family-name">Nom de la famille *</Label>
            <Input
              id="family-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Épicerie"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="family-category">Catégorie *</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryType)}
            >
              <SelectTrigger id="family-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alimentaire">Alimentaire</SelectItem>
                <SelectItem value="Non alimentaire">Non alimentaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
