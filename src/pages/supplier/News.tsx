
import { useState } from 'react';
import { useNews } from '@/context/news';
import { useAuth } from '@/context/AuthContext';
import { NewsItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import NewsCard from '@/components/news/NewsCard';
import NewsFormDialog from '@/components/news/NewsFormDialog';
import AddImageDialog from '@/components/news/AddImageDialog';
import { NewsFormValues, convertFormToNewsData, convertNewsToFormData } from '@/lib/news-schemas';
import { useToast } from '@/components/ui/use-toast';

const NewsManagement = () => {
  const { newsItems, addNewsItem, updateNewsItem, deleteNewsItem } = useNews();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedNewsForImage, setSelectedNewsForImage] = useState<NewsItem | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  if (!user) return null;
  
  // Filter news based on the user's role
  // Suppliers can see only their news, admins can see all news
  const filteredNews = user.role === 'admin' 
    ? newsItems 
    : newsItems.filter(news => news.authorId === user.id);
  
  const handleCreateNews = (data: NewsFormValues) => {
    addNewsItem(convertFormToNewsData(
      data, 
      user.id, 
      user.organization || user.name,
      user.role
    ));
    
    setIsNewDialogOpen(false);
  };
  
  const handleOpenEditDialog = (news: NewsItem) => {
    setSelectedNews(news);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateNews = (data: NewsFormValues) => {
    if (!selectedNews) return;
    
    updateNewsItem(selectedNews.id, {
      ...convertFormToNewsData(
        data,
        user.id,
        user.organization || user.name,
        user.role
      ),
      // Remove these properties as they shouldn't be updated
      authorId: undefined,
      authorName: undefined,
      authorRole: undefined
    });
    
    setSelectedNews(null);
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteNews = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      deleteNewsItem(id);
    }
  };

  const openImageDialog = (news: NewsItem) => {
    setSelectedNewsForImage(news);
    setImageUrl(news.imageUrl || '');
    setImageDialogOpen(true);
  };
  
  const handleImageSave = () => {
    if (selectedNewsForImage) {
      updateNewsItem(selectedNewsForImage.id, { imageUrl });
      setImageDialogOpen(false);
      setSelectedNewsForImage(null);
      toast({
        title: "Image ajoutée",
        description: "L'image a été ajoutée à l'actualité avec succès."
      });
    }
  };

  // Default form values for new news
  const defaultValues: NewsFormValues = {
    title: "",
    content: "",
    type: "info",
    expiresAt: "",
    visibleToClient: true,
    visibleToSupplier: false,
    visibleToAdmin: false,
    imageUrl: "",
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ozego-blue">Gestion des actualités</h1>
        <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle actualité
            </Button>
          </DialogTrigger>
          <NewsFormDialog
            open={isNewDialogOpen}
            onOpenChange={setIsNewDialogOpen}
            onSubmit={handleCreateNews}
            initialValues={defaultValues}
            title="Créer une nouvelle actualité"
            description="Cette actualité sera visible par les utilisateurs sélectionnés."
            submitLabel="Publier"
            userRole={user.role}
          />
        </Dialog>
      </div>
      
      {filteredNews.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Vous n'avez pas encore créé d'actualité.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(news => (
            <NewsCard 
              key={news.id}
              news={news}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteNews}
              onAddImage={!news.imageUrl ? openImageDialog : undefined}
            />
          ))}
        </div>
      )}
      
      {/* Edit Dialog */}
      {selectedNews && (
        <NewsFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateNews}
          initialValues={convertNewsToFormData(selectedNews)}
          title="Modifier l'actualité"
          description="Apportez les modifications nécessaires et enregistrez."
          submitLabel="Enregistrer"
          userRole={user.role}
        />
      )}

      {/* Image Dialog */}
      <AddImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        selectedNews={selectedNewsForImage}
        onSave={handleImageSave}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
      />
    </div>
  );
};

export default NewsManagement;
