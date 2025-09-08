
import { NewsItem } from '@/types';

// Sample news items for demonstration
export const mockNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Nouveaux produits bios disponibles',
    content: 'Nous avons ajouté une nouvelle gamme de produits biologiques dans notre catalogue. Découvrez-les dès maintenant !',
    type: 'info',
    authorId: 'supplier1',
    authorName: 'Ferme Biologique',
    authorRole: 'supplier',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    visibleToRoles: ['client', 'supplier', 'admin'],
    status: 'approved',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Offre spéciale sur les fruits de saison',
    content: 'Profitez de 15% de réduction sur tous les fruits de saison jusqu\'à la fin du mois. Commandez dès maintenant pour en profiter !',
    type: 'offer',
    authorId: 'supplier2',
    authorName: 'Fruits & Co',
    authorRole: 'supplier',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    visibleToRoles: ['client'],
    relatedProductIds: ['product1', 'product2'],
    status: 'approved',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    title: 'Maintenance prévue du système',
    content: 'Notre plateforme sera temporairement indisponible pour maintenance le samedi 20 avril de 2h à 4h du matin. Nous nous excusons pour la gêne occasionnée.',
    type: 'announcement',
    authorId: 'admin1',
    authorName: 'Équipe Ozego',
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    visibleToRoles: ['client', 'supplier', 'admin'],
    status: 'approved',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop',
  },
];
