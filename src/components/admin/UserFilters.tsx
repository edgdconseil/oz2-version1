
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRole: string | null;
  setSelectedRole: (role: string | null) => void;
  showActive: boolean | null;
  setShowActive: (active: boolean | null) => void;
  onResetFilters: () => void;
}

const UserFilters = ({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  showActive,
  setShowActive,
  onResetFilters
}: UserFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filtres</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom, email ou organisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedRole || "all"} onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les rôles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="supplier">Fournisseur</SelectItem>
              <SelectItem value="admin">Administrateur</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={showActive === null ? "all" : showActive.toString()} onValueChange={(value) => setShowActive(value === "all" ? null : value === "true")}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="true">Actifs</SelectItem>
              <SelectItem value="false">Inactifs</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={onResetFilters}>
            <X className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilters;
