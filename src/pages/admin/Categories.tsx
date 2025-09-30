import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddFamilyDialog } from '@/components/admin/AddFamilyDialog';
import { AddSubFamilyDialog } from '@/components/admin/AddSubFamilyDialog';
import { FamilyTable } from '@/components/admin/FamilyTable';
import { SubFamilyTable } from '@/components/admin/SubFamilyTable';
import { Family, SubFamily } from '@/types/category';

const Categories = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [subFamilies, setSubFamilies] = useState<SubFamily[]>([]);
  const [isFamilyDialogOpen, setIsFamilyDialogOpen] = useState(false);
  const [isSubFamilyDialogOpen, setIsSubFamilyDialogOpen] = useState(false);

  const handleAddFamily = (family: Family) => {
    setFamilies([...families, family]);
  };

  const handleDeleteFamily = (id: string) => {
    setFamilies(families.filter(f => f.id !== id));
    // Supprimer aussi les sous-familles associées
    setSubFamilies(subFamilies.filter(sf => sf.familyId !== id));
  };

  const handleAddSubFamily = (subFamily: SubFamily) => {
    setSubFamilies([...subFamilies, subFamily]);
  };

  const handleDeleteSubFamily = (id: string) => {
    setSubFamilies(subFamilies.filter(sf => sf.id !== id));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Gestion des Catégories</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les familles et sous-familles de produits
        </p>
      </div>

      <Tabs defaultValue="families" className="space-y-4">
        <TabsList>
          <TabsTrigger value="families">Familles</TabsTrigger>
          <TabsTrigger value="subfamilies">Sous-familles</TabsTrigger>
        </TabsList>

        <TabsContent value="families">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Familles de produits</CardTitle>
              <Button onClick={() => setIsFamilyDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une famille
              </Button>
            </CardHeader>
            <CardContent>
              <FamilyTable 
                families={families} 
                onDelete={handleDeleteFamily}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subfamilies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sous-familles de produits</CardTitle>
              <Button onClick={() => setIsSubFamilyDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une sous-famille
              </Button>
            </CardHeader>
            <CardContent>
              <SubFamilyTable 
                subFamilies={subFamilies}
                families={families}
                onDelete={handleDeleteSubFamily}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddFamilyDialog
        open={isFamilyDialogOpen}
        onOpenChange={setIsFamilyDialogOpen}
        onAdd={handleAddFamily}
      />

      <AddSubFamilyDialog
        open={isSubFamilyDialogOpen}
        onOpenChange={setIsSubFamilyDialogOpen}
        onAdd={handleAddSubFamily}
        families={families}
      />
    </div>
  );
};

export default Categories;
