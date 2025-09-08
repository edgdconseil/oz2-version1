
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNews } from '@/context/news';
import ApprovalTab from '@/components/news/ApprovalTab';
import SupplierNews from '../supplier/News';

const AdminNews = () => {
  const [activeTab, setActiveTab] = useState<string>('approval');
  const { getPendingNews } = useNews();
  const pendingNews = getPendingNews();
  
  return (
    <div className="container py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="approval">
            Validation des actualités
            {pendingNews.length > 0 && (
              <Badge variant="default" className="ml-2">{pendingNews.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="management">Gestion des actualités</TabsTrigger>
        </TabsList>
        
        <TabsContent value="approval">
          <ApprovalTab />
        </TabsContent>
        
        <TabsContent value="management">
          {/* Réutiliser le composant SupplierNews pour la gestion des actualités */}
          <SupplierNews />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNews;
