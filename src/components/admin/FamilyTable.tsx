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
import { Family } from '@/types/category';
import { Badge } from '@/components/ui/badge';

interface FamilyTableProps {
  families: Family[];
  onDelete: (id: string) => void;
}

export const FamilyTable = ({ families, onDelete }: FamilyTableProps) => {
  if (families.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune famille créée pour le moment
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
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {families.map((family) => (
          <TableRow key={family.id}>
            <TableCell className="font-mono text-sm">{family.id}</TableCell>
            <TableCell className="font-medium">{family.name}</TableCell>
            <TableCell>
              <Badge variant={family.category === 'Alimentaire' ? 'default' : 'secondary'}>
                {family.category}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(family.id)}
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
