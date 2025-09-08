
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, MapPin } from 'lucide-react';
import { User, Depot, ClientDepotAssignment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DepotSelectionDialogProps {
  user: User;
  onUpdateDepotAssignments: (userId: string, assignments: ClientDepotAssignment[]) => void;
  depots: Depot[];
  existingAssignments: ClientDepotAssignment[];
}

const DepotSelectionDialog = ({ 
  user, 
  onUpdateDepotAssignments, 
  depots, 
  existingAssignments 
}: DepotSelectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDepots, setSelectedDepots] = useState<Record<string, string>>({});

  // Filter depots by authorized suppliers
  const availableDepots = depots.filter(depot => 
    user.authorizedSuppliers?.includes(depot.supplierId) && depot.isActive
  );

  // Group depots by supplier
  const depotsBySupplier = availableDepots.reduce((acc, depot) => {
    if (!acc[depot.supplierId]) {
      acc[depot.supplierId] = [];
    }
    acc[depot.supplierId].push(depot);
    return acc;
  }, {} as Record<string, Depot[]>);

  // Initialize selected depots from existing assignments
  useEffect(() => {
    const initial: Record<string, string> = {};
    existingAssignments
      .filter(assignment => assignment.clientId === user.id)
      .forEach(assignment => {
        initial[assignment.supplierId] = assignment.depotId;
      });
    setSelectedDepots(initial);
  }, [existingAssignments, user.id]);

  const handleDepotSelection = (supplierId: string, depotId: string) => {
    setSelectedDepots(prev => ({
      ...prev,
      [supplierId]: depotId
    }));
  };

  const handleSave = () => {
    const newAssignments: ClientDepotAssignment[] = Object.entries(selectedDepots)
      .filter(([_, depotId]) => depotId)
      .map(([supplierId, depotId]) => {
        const depot = depots.find(d => d.id === depotId);
        const supplier = depots.find(d => d.supplierId === supplierId);
        
        return {
          id: `assign-${user.id}-${supplierId}-${Date.now()}`,
          clientId: user.id,
          clientName: user.name,
          supplierId,
          supplierName: supplier?.supplierName || '',
          depotId,
          depotName: depot?.name || '',
          assignedAt: new Date().toISOString(),
          assignedBy: 'admin'
        };
      });

    onUpdateDepotAssignments(user.id, newAssignments);
    setOpen(false);
  };

  if (user.role !== 'client' && user.role !== 'guest') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Building2 className="h-4 w-4 mr-2" />
          Dépôts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sélection des dépôts pour {user.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Sélectionnez un dépôt pour chaque fournisseur autorisé.
          </p>
          
          {Object.keys(depotsBySupplier).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun dépôt disponible. Assurez-vous que ce client a des fournisseurs autorisés et que ces fournisseurs ont des dépôts actifs.
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(depotsBySupplier).map(([supplierId, supplierDepots]) => (
                <Card key={supplierId}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {supplierDepots[0]?.supplierName}
                      <Badge variant="outline" className="ml-2">
                        {supplierDepots.length} dépôt{supplierDepots.length !== 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {supplierDepots.map((depot) => (
                        <div key={depot.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={depot.id}
                            checked={selectedDepots[supplierId] === depot.id}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleDepotSelection(supplierId, depot.id);
                              } else {
                                setSelectedDepots(prev => {
                                  const updated = { ...prev };
                                  delete updated[supplierId];
                                  return updated;
                                });
                              }
                            }}
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={depot.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {depot.name}
                            </label>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {depot.address}, {depot.city} {depot.postalCode}
                            </div>
                            {depot.phone && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Tél: {depot.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepotSelectionDialog;
