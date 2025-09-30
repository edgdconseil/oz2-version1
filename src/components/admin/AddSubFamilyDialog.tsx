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
import { SubFamily, CategoryType, Family } from '@/types/category';
import { useToast } from '@/hooks/use-toast';

interface AddSubFamilyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (subFamily: SubFamily) => void;
  families: Family[];
}

export const AddSubFamilyDialog = ({
  open,
  onOpenChange,
  onAdd,
  families,
}: AddSubFamilyDialogProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Alimentaire');
  const [familyId, setFamilyId] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom de la sous-famille est requis',
        variant: 'destructive',
      });
      return;
    }

    if (!familyId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une famille',
        variant: 'destructive',
      });
      return;
    }

    const newSubFamily: SubFamily = {
      id: `SUBFAM-${Date.now()}`,
      name: name.trim(),
      category,
      familyId,
    };

    onAdd(newSubFamily);
    toast({
      title: 'Sous-famille ajoutée',
      description: `La sous-famille "${name}" a été créée avec succès`,
    });

    // Reset form
    setName('');
    setCategory('Alimentaire');
    setFamilyId('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une sous-famille</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subfamily-name">Nom de la sous-famille *</Label>
            <Input
              id="subfamily-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Condiments"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subfamily-category">Catégorie *</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryType)}
            >
              <SelectTrigger id="subfamily-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alimentaire">Alimentaire</SelectItem>
                <SelectItem value="Non alimentaire">Non alimentaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subfamily-family">Famille parente *</Label>
            <Select value={familyId} onValueChange={setFamilyId}>
              <SelectTrigger id="subfamily-family">
                <SelectValue placeholder="Sélectionner une famille" />
              </SelectTrigger>
              <SelectContent>
                {families.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    Aucune famille disponible
                  </div>
                ) : (
                  families.map((family) => (
                    <SelectItem key={family.id} value={family.id}>
                      {family.name} ({family.category})
                    </SelectItem>
                  ))
                )}
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
