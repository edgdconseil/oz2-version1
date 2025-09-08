
import { useState } from 'react';
import { Building2, Plus, MapPin, Phone, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Depot, ClientDepotAssignment } from '@/types';
import { useProducts } from '@/context/ProductContext';
import AddDepotDialog from '@/components/admin/AddDepotDialog';
import EditDepotDialog from '@/components/admin/EditDepotDialog';
import ClientDepotAssignments from '@/components/admin/ClientDepotAssignments';

// Données mock pour les dépôts
const mockDepots: Depot[] = [
  {
    id: 'depot1',
    supplierId: '2',
    supplierName: 'Ferme Bio Locale',
    name: 'Dépôt Principal Lyon',
    address: '123 Avenue de la Paix',
    city: 'Lyon',
    postalCode: '69000',
    region: 'Auvergne-Rhône-Alpes',
    phone: '04 72 00 00 00',
    email: 'depot.lyon@fermebio.fr',
    isActive: true,
    deliveryZones: ['69000', '69001', '69002', '69003', '38000', '42000'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'depot2',
    supplierId: '2',
    supplierName: 'Ferme Bio Locale',
    name: 'Dépôt Secondaire Grenoble',
    address: '456 Rue des Alpes',
    city: 'Grenoble',
    postalCode: '38000',
    region: 'Auvergne-Rhône-Alpes',
    phone: '04 76 00 00 00',
    isActive: true,
    deliveryZones: ['38000', '38100', '38200', '73000'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  }
];

// Données mock pour les assignations client-dépôt
const mockAssignments: ClientDepotAssignment[] = [
  {
    id: 'assign1',
    clientId: '1',
    clientName: 'EHPAD Les Tilleuls',
    supplierId: '2',
    supplierName: 'Ferme Bio Locale',
    depotId: 'depot1',
    depotName: 'Dépôt Principal Lyon',
    assignedAt: '2024-01-20T10:00:00Z',
    assignedBy: 'admin'
  }
];

const AdminDepots = () => {
  const [depots, setDepots] = useState<Depot[]>(mockDepots);
  const [assignments, setAssignments] = useState<ClientDepotAssignment[]>(mockAssignments);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const { toast } = useToast();
  const { products } = useProducts();

  // Récupérer la liste des fournisseurs uniques
  const suppliers = products.reduce((acc, product) => {
    if (!acc.find(s => s.id === product.supplierId)) {
      acc.push({
        id: product.supplierId,
        name: product.supplierName
      });
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  // Filtrer les dépôts par fournisseur
  const filteredDepots = selectedSupplier === 'all' 
    ? depots 
    : depots.filter(depot => depot.supplierId === selectedSupplier);

  const handleAddDepot = (depotData: Omit<Depot, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDepot: Depot = {
      ...depotData,
      id: `depot-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDepots(prev => [...prev, newDepot]);
    toast({
      title: 'Dépôt créé',
      description: `Le dépôt ${newDepot.name} a été ajouté avec succès.`
    });
  };

  const handleEditDepot = (depotId: string, depotData: Partial<Depot>) => {
    setDepots(prev => prev.map(depot => 
      depot.id === depotId 
        ? { ...depot, ...depotData, updatedAt: new Date().toISOString() }
        : depot
    ));
    toast({
      title: 'Dépôt modifié',
      description: 'Les informations du dépôt ont été mises à jour.'
    });
  };

  const toggleDepotStatus = (depotId: string) => {
    setDepots(prev => prev.map(depot => 
      depot.id === depotId 
        ? { ...depot, isActive: !depot.isActive, updatedAt: new Date().toISOString() }
        : depot
    ));
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Building2 className="h-6 w-6 mr-2 text-ozego-primary" />
          <h1 className="text-2xl font-bold text-ozego-text">Gestion des Dépôts</h1>
        </div>
        <AddDepotDialog suppliers={suppliers} onAddDepot={handleAddDepot} />
      </div>

      <Tabs defaultValue="depots" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="depots">Dépôts</TabsTrigger>
          <TabsTrigger value="assignments">Assignations Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="depots" className="space-y-6">
          {/* Filtre par fournisseur */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSupplier === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSupplier('all')}
            >
              Tous les fournisseurs
            </Button>
            {suppliers.map(supplier => (
              <Button
                key={supplier.id}
                variant={selectedSupplier === supplier.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSupplier(supplier.id)}
              >
                {supplier.name}
              </Button>
            ))}
          </div>

          {/* Liste des dépôts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepots.map(depot => (
              <Card key={depot.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{depot.name}</CardTitle>
                    <Badge variant={depot.isActive ? 'default' : 'secondary'}>
                      {depot.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-ozego-secondary">{depot.supplierName}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-ozego-secondary mt-0.5" />
                    <div className="text-sm">
                      <p>{depot.address}</p>
                      <p>{depot.postalCode} {depot.city}</p>
                      <p className="text-ozego-secondary">{depot.region}</p>
                    </div>
                  </div>

                  {depot.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-ozego-secondary" />
                      <span className="text-sm">{depot.phone}</span>
                    </div>
                  )}

                  {depot.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-ozego-secondary" />
                      <span className="text-sm">{depot.email}</span>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-1">Zones de livraison :</p>
                    <div className="flex flex-wrap gap-1">
                      {depot.deliveryZones.slice(0, 3).map(zone => (
                        <Badge key={zone} variant="outline" className="text-xs">
                          {zone}
                        </Badge>
                      ))}
                      {depot.deliveryZones.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{depot.deliveryZones.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <EditDepotDialog
                      depot={depot}
                      suppliers={suppliers}
                      onEditDepot={handleEditDepot}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleDepotStatus(depot.id)}
                    >
                      {depot.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDepots.length === 0 && (
            <div className="text-center py-10">
              <Building2 className="h-12 w-12 text-ozego-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-ozego-text mb-2">
                Aucun dépôt trouvé
              </h3>
              <p className="text-ozego-secondary mb-4">
                {selectedSupplier === 'all' 
                  ? 'Commencez par ajouter votre premier dépôt.'
                  : 'Aucun dépôt pour ce fournisseur.'}
              </p>
              <AddDepotDialog suppliers={suppliers} onAddDepot={handleAddDepot} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="assignments">
          <ClientDepotAssignments
            assignments={assignments}
            depots={depots}
            onUpdateAssignments={setAssignments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDepots;
