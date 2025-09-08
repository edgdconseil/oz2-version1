
import { useState, useMemo } from 'react';
import { User } from '@/types';

export const useUserFilters = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showActive, setShowActive] = useState<boolean | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search query filter
      if (searchQuery && 
          !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(user.organization && user.organization.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }
      
      // Role filter
      if (selectedRole && user.role !== selectedRole) {
        return false;
      }
      
      // Active status filter
      if (showActive !== null && user.isActive !== showActive) {
        return false;
      }
      
      return true;
    });
  }, [users, searchQuery, selectedRole, showActive]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole(null);
    setShowActive(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    showActive,
    setShowActive,
    filteredUsers,
    resetFilters
  };
};
