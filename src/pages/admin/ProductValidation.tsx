
import React, { useState } from 'react';
import { useProductUpdate } from '@/context/ProductUpdateContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import UpdateRequestsTable from '@/components/products/UpdateRequestsTable';
import AdminValidationDialog from '@/components/products/AdminValidationDialog';

const ProductValidation = () => {
  const { updateRequests, getPendingRequests } = useProductUpdate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [supplierFilter, setSupplierFilter] = useState<string>('all');

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-8">
        <p className="text-center text-gray-500">Accès non autorisé</p>
      </div>
    );
  }

  const pendingRequests = getPendingRequests();
  const approvedRequests = updateRequests.filter(r => r.status === 'approved');
  const rejectedRequests = updateRequests.filter(r => r.status === 'rejected');

  // Filtrage des demandes
  const filteredRequests = updateRequests.filter(request => {
    const matchesSearch = 
      request.originalData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.originalData.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSupplier = supplierFilter === 'all' || request.supplierId === supplierFilter;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  // Liste unique des fournisseurs
  const uniqueSuppliers = Array.from(
    new Set(updateRequests.map(r => ({ id: r.supplierId, name: r.supplierName })))
  );

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ozego-blue">Validation des produits</h1>
          <p className="text-gray-600">Gérez les demandes de modification des fournisseurs</p>
        </div>
        <div className="flex gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nom, fournisseur, référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Fournisseur</label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {uniqueSuppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="relative">
            En attente
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">Toutes les demandes</TabsTrigger>
          <TabsTrigger value="approved">Approuvées</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <UpdateRequestsTable requests={pendingRequests} isSupplierView={false} />
        </TabsContent>

        <TabsContent value="all">
          <UpdateRequestsTable requests={filteredRequests} isSupplierView={false} />
        </TabsContent>

        <TabsContent value="approved">
          <UpdateRequestsTable requests={approvedRequests} isSupplierView={false} />
        </TabsContent>

        <TabsContent value="rejected">
          <UpdateRequestsTable requests={rejectedRequests} isSupplierView={false} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductValidation;
