
import { useNews } from '@/context/news';
import { useToast } from '@/components/ui/use-toast';
import PendingNewsCard from './PendingNewsCard';
import RejectNewsDialog from './RejectNewsDialog';
import AddImageDialog from './AddImageDialog';
import { NewsItem } from '@/types';
import { useState } from 'react';

const ApprovalTab = () => {
  const { getPendingNews, approveNewsItem, rejectNewsItem, updateNewsItem } = useNews();
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedNewsForImage, setSelectedNewsForImage] = useState<NewsItem | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const pendingNews = getPendingNews();
  
  const handleApproveNews = (id: string) => {
    approveNewsItem(id);
  };
  
  const openRejectDialog = (id: string) => {
    setSelectedNewsId(id);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };
  
  const handleRejectNews = () => {
    if (selectedNewsId && rejectionReason.trim()) {
      rejectNewsItem(selectedNewsId, rejectionReason);
      setRejectDialogOpen(false);
      setSelectedNewsId(null);
      setRejectionReason('');
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez fournir un motif de rejet.",
        variant: "destructive"
      });
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-ozego-blue">Validation des actualités</h1>
      </div>
      
      {pendingNews.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune actualité en attente de validation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingNews.map(news => (
            <PendingNewsCard
              key={news.id}
              news={news}
              onApprove={handleApproveNews}
              onReject={openRejectDialog}
              onAddImage={openImageDialog}
            />
          ))}
        </div>
      )}
      
      <RejectNewsDialog 
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleRejectNews}
      />
      
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

export default ApprovalTab;
