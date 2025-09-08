
import { useState } from 'react';
import { User, Depot, ClientDepotAssignment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useUserFilters } from '@/hooks/useUserFilters';
import UserFilters from '@/components/admin/UserFilters';
import UserTable from '@/components/admin/UserTable';
import UserActions from '@/components/admin/UserActions';

// Données utilisateurs de test
const initialUsers: User[] = [
  { id: 'user1', email: 'client1@example.com', name: 'Jean Dupont', role: 'client', isActive: true, authorizedSuppliers: [] },
  { id: 'user2', email: 'supplier1@farmfresh.com', name: 'Paul Legrand', role: 'supplier', isActive: true, organization: 'Ferme Bio Locale' },
  { id: 'user3', email: 'admin@ozego.com', name: 'Admin Principal', role: 'admin', isActive: true },
];

// Mock data pour les dépôts
const mockDepots: Depot[] = [
  {
    id: 'depot1',
    supplierId: '2',
    supplierName: 'Ferme Bio Locale',
    name: 'Dépôt Nord',
    address: '123 Rue de la Ferme',
    city: 'Lille',
    postalCode: '59000',
    region: 'Hauts-de-France',
    phone: '03 20 00 00 00',
    email: 'depot.nord@ferme-bio.fr',
    isActive: true,
    deliveryZones: ['59', '62', '80'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'depot2',
    supplierId: '2',
    supplierName: 'Ferme Bio Locale',
    name: 'Dépôt Sud',
    address: '456 Avenue du Soleil',
    city: 'Marseille',
    postalCode: '13000',
    region: 'Provence-Alpes-Côte d\'Azur',
    phone: '04 91 00 00 00',
    email: 'depot.sud@ferme-bio.fr',
    isActive: true,
    deliveryZones: ['13', '83', '84'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editMode, setEditMode] = useState(false);
  const [depotAssignments, setDepotAssignments] = useState<ClientDepotAssignment[]>([]);
  const { toast } = useToast();
  
  const {
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    showActive,
    setShowActive,
    filteredUsers,
    resetFilters
  } = useUserFilters(users);

  // Ajouter un utilisateur
  const handleAddUser = (userData: Omit<User, 'id' | 'isActive'>) => {
    const user: User = {
      id: `user-${Date.now()}`,
      isActive: true,
      authorizedSuppliers: (userData.role === 'client' || userData.role === 'guest') ? [] : undefined,
      ...userData
    };

    setUsers(prev => [...prev, user]);
    
    toast({
      title: 'Utilisateur créé',
      description: `${user.name} a été ajouté avec succès.`
    });
  };

  // Basculer le statut d'un utilisateur
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  // Mettre à jour un champ utilisateur
  const updateUserField = (userId: string, field: keyof User, value: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, [field]: value } : user
    ));
  };

  // Mettre à jour les fournisseurs autorisés d'un client ou invité
  const updateUserAuthorizedSuppliers = (userId: string, authorizedSuppliers: string[]) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, authorizedSuppliers } : user
    ));
    
    toast({
      title: 'Fournisseurs mis à jour',
      description: 'Les fournisseurs autorisés ont été modifiés avec succès.'
    });
  };

  // Mettre à jour les assignations de dépôts
  const updateDepotAssignments = (userId: string, newAssignments: ClientDepotAssignment[]) => {
    // Supprimer les anciennes assignations pour ce client
    const filteredAssignments = depotAssignments.filter(assignment => assignment.clientId !== userId);
    
    // Ajouter les nouvelles assignations
    setDepotAssignments([...filteredAssignments, ...newAssignments]);
    
    toast({
      title: 'Dépôts mis à jour',
      description: 'Les assignations de dépôts ont été modifiées avec succès.'
    });
  };

  // Export des utilisateurs
  const handleExport = () => {
    // Mock export function
    toast({
      title: 'Export',
      description: 'Fonctionnalité d\'export en cours de développement.'
    });
  };

  // Import des utilisateurs
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mock import function
    toast({
      title: 'Import',
      description: 'Fonctionnalité d\'import en cours de développement.'
    });
    event.target.value = '';
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <UserActions 
          editMode={editMode}
          setEditMode={setEditMode}
          onExport={handleExport}
          onImport={handleImport}
          onAddUser={handleAddUser}
        />
      </div>
      
      <UserFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        showActive={showActive}
        setShowActive={setShowActive}
        onResetFilters={resetFilters}
      />
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Aucun utilisateur trouvé
        </div>
      ) : (
        <>
          <UserTable 
            users={filteredUsers} 
            editMode={editMode}
            onToggleUserStatus={toggleUserStatus}
            onUpdateUserField={updateUserField}
            onUpdateUserAuthorizedSuppliers={updateUserAuthorizedSuppliers}
            onUpdateDepotAssignments={updateDepotAssignments}
            depots={mockDepots}
            depotAssignments={depotAssignments}
          />
          
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} sur {users.length} au total
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
