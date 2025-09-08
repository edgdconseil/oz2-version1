
import { useState } from 'react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';

export const useUserOperations = (initialUsers: User[]) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const handleExportToExcel = (filteredUsers: User[]) => {
    const exportData = filteredUsers.map(u => ({
      'Nom': u.name,
      'Email': u.email,
      'Organisation': u.organization || '',
      'Rôle': u.role === 'client' ? 'Client' : u.role === 'supplier' ? 'Fournisseur' : 'Administrateur',
      'Actif': u.isActive ? 'Oui' : 'Non',
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');
    
    XLSX.writeFile(workbook, 'utilisateurs-ozego.xlsx');
    
    toast({
      title: 'Export réussi',
      description: `${exportData.length} utilisateurs exportés vers Excel.`
    });
  };

  const handleImportFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        toast({
          title: 'Import réussi',
          description: `${jsonData.length} utilisateurs importés. Traitement en cours...`
        });
        
      } catch (error) {
        toast({
          title: 'Erreur d\'import',
          description: 'Le fichier ne semble pas être au format attendu.',
          variant: 'destructive'
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: user.isActive ? 'Utilisateur désactivé' : 'Utilisateur activé',
        description: `${user.name} a été ${user.isActive ? 'désactivé' : 'activé'} avec succès.`
      });
    }
  };

  const updateUserField = (userId: string, field: keyof User, value: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, [field]: value } : user
    ));
  };

  const handleAddUser = (newUserData: Omit<User, 'id' | 'isActive'>) => {
    const newUser: User = {
      ...newUserData,
      id: `user-${Date.now()}`,
      isActive: true,
    };
    
    setUsers(prev => [...prev, newUser]);
    
    toast({
      title: 'Utilisateur créé',
      description: `${newUser.name} a été ajouté avec succès comme ${newUser.role === 'client' ? 'client' : 'fournisseur'}.`
    });
  };

  return {
    users,
    handleExportToExcel,
    handleImportFromExcel,
    toggleUserStatus,
    updateUserField,
    handleAddUser
  };
};
