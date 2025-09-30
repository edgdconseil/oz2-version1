import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { SubFamily, Family } from '@/types/category';
import { Badge } from '@/components/ui/badge';

interface SubFamilyTableProps {
  subFamilies: SubFamily[];
  families: Family[];
  onDelete: (id: string) => void;
}

export const SubFamilyTable = ({ subFamilies, families, onDelete }: SubFamilyTableProps) => {
  const getFamilyName = (familyId: string) => {
    const family = families.find(f => f.id === familyId);
    return family ? family.name : 'N/A';
  };

  if (subFamilies.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune sous-famille créée pour le moment
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Famille parente</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subFamilies.map((subFamily) => (
          <TableRow key={subFamily.id}>
            <TableCell className="font-mono text-sm">{subFamily.id}</TableCell>
            <TableCell className="font-medium">{subFamily.name}</TableCell>
            <TableCell>
              <Badge variant={subFamily.category === 'Alimentaire' ? 'default' : 'secondary'}>
                {subFamily.category}
              </Badge>
            </TableCell>
            <TableCell>{getFamilyName(subFamily.familyId)}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(subFamily.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
