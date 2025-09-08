
import { Recipe } from '@/types';

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Gratin de pommes de terre',
    description: 'Un gratin de pommes de terre crémeux et savoureux, parfait en accompagnement.',
    servings: 4,
    prepTime: 20,
    cookTime: 45,
    ingredients: [
      {
        productId: '1',
        productName: 'Pommes Bio',
        quantity: 1,
        unit: 'kg'
      },
      {
        productId: '4',
        productName: 'Yaourt Nature',
        quantity: 200,
        unit: 'g'
      }
    ],
    instructions: [
      'Préchauffer le four à 180°C.',
      'Éplucher et trancher finement les pommes de terre.',
      'Disposer les tranches dans un plat à gratin.',
      'Mélanger le yaourt avec un peu de sel et de poivre.',
      'Verser le mélange sur les pommes de terre.',
      'Enfourner pour 45 minutes jusqu\'à ce que le dessus soit doré.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568376794508-ae52c6ab3929?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['végétarien', 'accompagnement', 'four'],
    createdBy: '1',
    createdByName: 'EHPAD Les Tilleuls'
  },
  {
    id: '2',
    name: 'Salade de carottes',
    description: 'Une salade fraîche et croquante, idéale en entrée ou en accompagnement léger.',
    servings: 4,
    prepTime: 15,
    cookTime: 0,
    ingredients: [
      {
        productId: '2',
        productName: 'Carottes',
        quantity: 500,
        unit: 'g'
      },
      {
        productId: '11',
        productName: 'Pain complet',
        quantity: 100,
        unit: 'g'
      }
    ],
    instructions: [
      'Éplucher et râper les carottes.',
      'Couper le pain complet en petits cubes pour faire des croûtons.',
      'Mélanger les carottes râpées avec une vinaigrette légère.',
      'Ajouter les croûtons au moment de servir.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1522184216316-3c25379f9760?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['végétarien', 'entrée', 'sans cuisson'],
    createdBy: '1',
    createdByName: 'EHPAD Les Tilleuls'
  },
  {
    id: '3',
    name: 'Poulet rôti aux herbes',
    description: 'Un poulet rôti savoureux aux herbes de Provence, un classique qui plaît à tous.',
    servings: 4,
    prepTime: 15,
    cookTime: 75,
    ingredients: [
      {
        productId: '3',
        productName: 'Poulet Fermier',
        quantity: 1,
        unit: 'pièce'
      },
      {
        productId: '1',
        productName: 'Pommes Bio',
        quantity: 500,
        unit: 'g'
      }
    ],
    instructions: [
      'Préchauffer le four à 200°C.',
      'Préparer le poulet en le frottant avec de l\'huile d\'olive, du sel et des herbes.',
      'Couper les pommes en quartiers et les placer autour du poulet.',
      'Enfourner pour 1h15, en arrosant régulièrement avec le jus de cuisson.',
      'Laisser reposer 10 minutes avant de découper et servir.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    tags: ['viande', 'plat principal', 'four'],
    createdBy: '1',
    createdByName: 'EHPAD Les Tilleuls'
  }
];
