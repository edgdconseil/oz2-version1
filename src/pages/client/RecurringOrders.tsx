import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Play, Pause, Calendar } from 'lucide-react';
import { useRecurringOrders } from '@/context/RecurringOrderContext';
import { RecurringOrderForm } from '@/components/recurring-orders/RecurringOrderForm';
import { RecurringOrder, RecurringFrequency } from '@/types/recurring-order';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';

const frequencyLabels: Record<RecurringFrequency, string> = {
  weekly: 'Hebdomadaire',
  biweekly: 'Quinzaine',
  monthly: 'Mensuelle',
  quarterly: 'Trimestrielle',
  biannual: 'Semestrielle',
};

export const RecurringOrders: React.FC = () => {
  const { user } = useAuth();
  const {
    recurringOrders,
    createRecurringOrder,
    updateRecurringOrder,
    deleteRecurringOrder,
    toggleRecurringOrder,
    executeRecurringOrder,
  } = useRecurringOrders();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<RecurringOrder | undefined>();

  if (!user || (user.role !== 'client' && user.role !== 'guest')) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Accès non autorisé</p>
        </div>
      </Layout>
    );
  }

  const handleEdit = (order: RecurringOrder) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande récurrente ?')) {
      deleteRecurringOrder(orderId);
    }
  };

  const handleExecuteNow = (orderId: string) => {
    executeRecurringOrder(orderId);
  };

  const handleFormSubmit = (orderData: Omit<RecurringOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingOrder) {
      updateRecurringOrder(editingOrder.id, orderData);
    } else {
      createRecurringOrder(orderData);
    }
    setEditingOrder(undefined);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingOrder(undefined);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Commandes récurrentes</h1>
            <p className="text-muted-foreground">
              Programmez des commandes automatiques qui seront ajoutées à votre panier selon la périodicité choisie
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle commande récurrente
          </Button>
        </div>

        {recurringOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune commande récurrente</h3>
              <p className="text-muted-foreground mb-4">
                Créez votre première commande récurrente pour automatiser vos achats réguliers
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une commande récurrente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recurringOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {order.name}
                         <Badge variant={order.isActive ? 'default' : 'destructive'} className={order.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                           {order.isActive ? '🟢 Active' : '🔴 Inactive'}
                         </Badge>
                      </CardTitle>
                      <CardDescription>
                        Fréquence: {frequencyLabels[order.frequency]} • {order.items.length} produit{order.items.length > 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => toggleRecurringOrder(order.id)}
                      >
                        {order.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleEdit(order)}
                        title="Modifier la commande récurrente"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Prochaine exécution:</span>{' '}
                      {format(new Date(order.nextExecutionDate), 'PPP', { locale: fr })}
                    </div>
                    {order.lastExecutionDate && (
                      <div>
                        <span className="font-medium">Dernière exécution:</span>{' '}
                        {format(new Date(order.lastExecutionDate), 'PPP', { locale: fr })}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Produits commandés:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Fournisseur</TableHead>
                          <TableHead className="text-right">Quantité</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.supplierName}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExecuteNow(order.id)}
                    >
                      Exécuter maintenant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <RecurringOrderForm
          open={isFormOpen}
          onOpenChange={handleFormClose}
          onSubmit={handleFormSubmit}
          editOrder={editingOrder}
        />
      </div>
    </Layout>
  );
};