
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import AddUserDialog from './AddUserDialog';
import { User } from '@/types';

interface UserActionsProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddUser: (user: Omit<User, 'id' | 'isActive'>) => void;
}

const UserActions = ({
  editMode,
  setEditMode,
  onExport,
  onImport,
  onAddUser
}: UserActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button variant="outline" onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Quitter le mode édition' : 'Mode édition'}
      </Button>
      <Button variant="outline" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Exporter
      </Button>
      <div className="relative">
        <input
          type="file"
          id="import-excel"
          onChange={onImport}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          accept=".xlsx,.xls"
        />
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importer
        </Button>
      </div>
      <AddUserDialog onAddUser={onAddUser} />
    </div>
  );
};

export default UserActions;
