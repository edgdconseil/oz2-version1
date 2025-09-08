
import { User, Depot, ClientDepotAssignment } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import SupplierSelectionDialog from './SupplierSelectionDialog';
import DepotSelectionDialog from './DepotSelectionDialog';

interface UserTableProps {
  users: User[];
  editMode: boolean;
  onToggleUserStatus: (userId: string) => void;
  onUpdateUserField: (userId: string, field: keyof User, value: string) => void;
  onUpdateUserAuthorizedSuppliers: (userId: string, authorizedSuppliers: string[]) => void;
  onUpdateDepotAssignments: (userId: string, assignments: ClientDepotAssignment[]) => void;
  depots: Depot[];
  depotAssignments: ClientDepotAssignment[];
}

const UserTable = ({
  users,
  editMode,
  onToggleUserStatus,
  onUpdateUserField,
  onUpdateUserAuthorizedSuppliers,
  onUpdateDepotAssignments,
  depots,
  depotAssignments
}: UserTableProps) => {
  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      client: 'bg-blue-100 text-blue-800',
      supplier: 'bg-green-100 text-green-800',
      admin: 'bg-accent text-accent-foreground',
      guest: 'bg-orange-100 text-orange-800'
    };
    
    const labels: Record<string, string> = {
      client: 'Client',
      supplier: 'Fournisseur',
      admin: 'Administrateur',
      guest: 'Invité'
    };
    
    return (
      <Badge className={variants[role] || 'bg-gray-100 text-gray-800'}>
        {labels[role] || role}
      </Badge>
    );
  };

  const getUserDepotCount = (userId: string) => {
    return depotAssignments.filter(assignment => assignment.clientId === userId).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Fournisseurs autorisés</TableHead>
              <TableHead>Dépôts assignés</TableHead>
              <TableHead>Statut</TableHead>
              {editMode && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editMode ? (
                    <Input
                      value={user.name}
                      onChange={(e) => onUpdateUserField(user.id, 'name', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    user.name
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      value={user.email}
                      onChange={(e) => onUpdateUserField(user.id, 'email', e.target.value)}
                      className="w-full"
                      type="email"
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      value={user.organization || ''}
                      onChange={(e) => onUpdateUserField(user.id, 'organization', e.target.value)}
                      className="w-full"
                      placeholder="Organisation"
                    />
                  ) : (
                    user.organization || '-'
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Select
                      value={user.role}
                      onValueChange={(value) => onUpdateUserField(user.id, 'role', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="supplier">Fournisseur</SelectItem>
                        <SelectItem value="guest">Invité</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getRoleBadge(user.role)
                  )}
                </TableCell>
                <TableCell>
                  {(user.role === 'client' || user.role === 'guest') ? (
                    <SupplierSelectionDialog
                      user={user}
                      onUpdateUser={onUpdateUserAuthorizedSuppliers}
                    />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {(user.role === 'client' || user.role === 'guest') ? (
                    <DepotSelectionDialog
                      user={user}
                      onUpdateDepotAssignments={onUpdateDepotAssignments}
                      depots={depots}
                      existingAssignments={depotAssignments}
                    />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => onToggleUserStatus(user.id)}
                      disabled={!editMode}
                    />
                    <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </TableCell>
                {editMode && (
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onToggleUserStatus(user.id)}
                    >
                      {user.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserTable;
