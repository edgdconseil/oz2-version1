
import { useState } from 'react';
import { Users, Building2, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientDepotAssignment, Depot } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ClientDepotAssignmentsProps {
  assignments: ClientDepotAssignment[];
  depots: Depot[];
  onUpdateAssignments: (assignments: ClientDepotAssignment[]) => void;
}

// Mock data pour les clients
const mockClients = [
  { id: '1', name: 'EHPAD Les Tilleuls', authorizedSuppliers: ['2'] },
  { id: '5', name: 'Compte Invité', authorizedSuppliers: ['2', '4'] }
];

const ClientDepotAssignments = ({ assignments, depots, onUpdateAssignments }: ClientDepotAssignmentsProps) => {
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedDepot, setSelectedDepot] = useState('');
  const { toast } = useToast();

  // Grouper les assignations par client
  const assignmentsByClient = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.clientId]) {
      acc[assignment.clientId] = [];
    }
    acc[assignment.clientId].push(assignment);
    return acc;
  }, {} as Record<string, ClientDepotAssignment[]>);

  // Obtenir les fournisseurs uniques
  const suppliers = depots.reduce((acc, depot) => {
    if (!acc.find(s => s.id === depot.supplierId)) {
      acc.push({
        id: depot.supplierId,
        name: depot.supplierName
      });
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  // Filtrer les dépôts par fournisseur sélectionné
  const availableDepots = selectedSupplier 
    ? depots.filter(depot => depot.supplierId === selectedSupplier && depot.isActive)
    : [];

  // Obtenir les fournisseurs autorisés pour le client sélectionné
  const authorizedSuppliers = selectedClient 
    ? mockClients.find(c => c.id === selectedClient)?.authorizedSuppliers || []
    : [];

  const filteredSuppliers = suppliers.filter(supplier => 
    authorizedSuppliers.includes(supplier.id)
  );

  const handleAddAssignment = () => {
    if (!selectedClient || !selectedSupplier || !selectedDepot) return;

    const client = mockClients.find(c => c.id === selectedClient);
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    const depot = depots.find(d => d.id === selectedDepot);

    if (!client || !supplier || !depot) return;

    // Vérifier si l'assignation existe déjà
    const existingAssignment = assignments.find(a => 
      a.clientId === selectedClient && a.supplierId === selectedSupplier
    );

    if (existingAssignment) {
      toast({
        title: 'Assignation existante',
        description: 'Ce client est déjà assigné à un dépôt pour ce fournisseur.',
        variant: 'destructive'
      });
      return;
    }

    const newAssignment: ClientDepotAssignment = {
      id: `assign-${Date.now()}`,
      clientId: selectedClient,
      clientName: client.name,
      supplierId: selectedSupplier,
      supplierName: supplier.name,
      depotId: selectedDepot,
      depotName: depot.name,
      assignedAt: new Date().toISOString(),
      assignedBy: 'admin'
    };

    onUpdateAssignments([...assignments, newAssignment]);
    
    toast({
      title: 'Assignation créée',
      description: `${client.name} a été assigné au dépôt ${depot.name}.`
    });

    // Reset form
    setSelectedClient('');
    setSelectedSupplier('');
    setSelectedDepot('');
    setOpen(false);
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    onUpdateAssignments(assignments.filter(a => a.id !== assignmentId));
    toast({
      title: 'Assignation supprimée',
      description: 'L\'assignation client-dépôt a été supprimée.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Assignations Client-Dépôt</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle assignation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assigner un client à un dépôt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Client</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Fournisseur</label>
                <Select 
                  value={selectedSupplier} 
                  onValueChange={(value) => {
                    setSelectedSupplier(value);
                    setSelectedDepot(''); // Reset depot selection
                  }}
                  disabled={!selectedClient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSuppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedClient && filteredSuppliers.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Ce client n'a aucun fournisseur autorisé.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Dépôt</label>
                <Select 
                  value={selectedDepot} 
                  onValueChange={setSelectedDepot}
                  disabled={!selectedSupplier}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un dépôt" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepots.map(depot => (
                      <SelectItem key={depot.id} value={depot.id}>
                        <div className="flex flex-col">
                          <span>{depot.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {depot.city} - {depot.postalCode}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddAssignment}
                  disabled={!selectedClient || !selectedSupplier || !selectedDepot}
                >
                  Créer l'assignation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune assignation</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par assigner des clients à des dépôts.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockClients.map(client => {
            const clientAssignments = assignmentsByClient[client.id] || [];
            
            return (
              <Card key={client.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {client.name}
                    <Badge variant="outline" className="ml-2">
                      {clientAssignments.length} dépôt{clientAssignments.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clientAssignments.length === 0 ? (
                    <p className="text-muted-foreground">Aucun dépôt assigné</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fournisseur</TableHead>
                          <TableHead>Dépôt</TableHead>
                          <TableHead>Localisation</TableHead>
                          <TableHead>Assigné le</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientAssignments.map(assignment => {
                          const depot = depots.find(d => d.id === assignment.depotId);
                          return (
                            <TableRow key={assignment.id}>
                              <TableCell className="font-medium">
                                {assignment.supplierName}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {assignment.depotName}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {depot?.city} ({depot?.postalCode})
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(assignment.assignedAt).toLocaleDateString('fr-FR')}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveAssignment(assignment.id)}
                                >
                                  Supprimer
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientDepotAssignments;
