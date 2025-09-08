
import React from 'react';
import { useInventorySync } from '@/hooks/useInventorySync';

interface InventorySyncWrapperProps {
  children: React.ReactNode;
}

const InventorySyncWrapper = ({ children }: InventorySyncWrapperProps) => {
  useInventorySync();
  return <>{children}</>;
};

export default InventorySyncWrapper;
