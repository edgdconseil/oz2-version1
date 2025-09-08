
import { TrainingCourse } from '@/types';

export const trainings: TrainingCourse[] = [
  {
    id: "1",
    title: "Audit de conformité HACCP",
    description: "Formation approfondie aux techniques d'audit HACCP pour garantir la conformité des processus alimentaires aux normes en vigueur.",
    type: "audit",
    level: "intermediate",
    duration: 16,
    price: 980,
    pricingType: "from",
    instructor: "Marie Dupont",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    location: "Paris",
    dateStart: "2025-05-12T09:00:00.000Z",
    dateEnd: "2025-05-13T17:00:00.000Z",
    maxParticipants: 12,
    createdAt: "2024-03-15T10:20:00.000Z",
    updatedAt: "2024-03-15T10:20:00.000Z",
    createdBy: "admin1",
    highlights: [
      "Maîtriser les techniques d'audit selon les exigences HACCP",
      "Identifier les points critiques dans les processus de production",
      "Rédiger des rapports d'audit conformes aux exigences réglementaires"
    ],
    contactPerson: "Marie Dupont",
    contactEmail: "marie.dupont@ozego.fr",
    contactPhone: "01 23 45 67 89",
    detailedContent: [
      "Module 1: Introduction aux principes HACCP et cadre réglementaire",
      "Module 2: Méthodologie d'audit et préparation",
      "Module 3: Techniques d'investigation et collecte de preuves",
      "Module 4: Analyse des écarts et évaluation des risques",
      "Module 5: Rédaction de rapports d'audit et suivi des actions correctives"
    ],
    technicalSheetUrl: "https://example.com/fiche-technique-audit-haccp.pdf"
  },
  {
    id: "2",
    title: "Certification ISO 22000",
    description: "Formation complète à la norme ISO 22000 pour les systèmes de management de la sécurité des denrées alimentaires.",
    type: "certification",
    level: "advanced",
    duration: 24,
    price: 1450,
    pricingType: "fixed",
    instructor: "Philippe Martin",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    location: "Lyon",
    dateStart: "2025-06-15T09:00:00.000Z",
    dateEnd: "2025-06-17T17:00:00.000Z",
    maxParticipants: 10,
    createdAt: "2024-03-10T14:30:00.000Z",
    updatedAt: "2024-03-10T14:30:00.000Z",
    createdBy: "admin1",
    highlights: [
      "Comprendre les exigences de la norme ISO 22000",
      "Mettre en place un système de management de la sécurité alimentaire",
      "Préparer son entreprise à la certification ISO 22000"
    ],
    contactPerson: "Philippe Martin",
    contactEmail: "philippe.martin@ozego.fr",
    contactPhone: "01 45 67 89 12",
    detailedContent: [
      "Module 1: Présentation des exigences de la norme ISO 22000:2018",
      "Module 2: Analyse des risques et points critiques",
      "Module 3: Documentation et enregistrements requis",
      "Module 4: Audits internes et revue de direction",
      "Module 5: Processus de certification et maintien du système"
    ],
    technicalSheetUrl: "https://example.com/fiche-technique-iso22000.pdf"
  },
  {
    id: "3",
    title: "Conseil en optimisation des processus de production",
    description: "Formation pratique pour améliorer l'efficacité et la qualité des processus de production alimentaire.",
    type: "consulting",
    level: "intermediate",
    duration: 14,
    price: 0,
    pricingType: "quote",
    instructor: "Sophie Bernard",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    location: "Nantes",
    maxParticipants: 8,
    createdAt: "2024-02-20T09:15:00.000Z",
    updatedAt: "2024-02-20T09:15:00.000Z",
    createdBy: "admin2",
    highlights: [
      "Analyser les flux de production et identifier les goulots d'étranglement",
      "Mettre en place des indicateurs de performance pertinents",
      "Implémenter des méthodes d'amélioration continue"
    ],
    contactPerson: "Sophie Bernard",
    contactEmail: "sophie.bernard@ozego.fr",
    contactPhone: "01 78 90 12 34",
    detailedContent: [
      "Module 1: Analyse des flux et cartographie des processus",
      "Module 2: Identification des pertes et gaspillages",
      "Module 3: Mise en place d'indicateurs de performance (KPIs)",
      "Module 4: Méthodes d'amélioration continue (Kaizen, 5S, SMED)",
      "Module 5: Gestion du changement et implication des équipes"
    ],
    technicalSheetUrl: "https://example.com/fiche-technique-optimisation.pdf"
  },
  {
    id: "4",
    title: "Management de la qualité en agroalimentaire",
    description: "Formation avancée pour les responsables qualité et directeurs d'établissements agroalimentaires.",
    type: "management",
    level: "advanced",
    duration: 21,
    price: 1750,
    pricingType: "from",
    instructor: "Jean Dubois",
    imageUrl: "https://images.unsplash.com/photo-1553028826-f4d53d0d7a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    location: "Bordeaux",
    dateStart: "2025-07-20T09:00:00.000Z",
    dateEnd: "2025-07-23T17:00:00.000Z",
    maxParticipants: 15,
    createdAt: "2024-01-15T11:45:00.000Z",
    updatedAt: "2024-01-15T11:45:00.000Z",
    createdBy: "admin1",
    highlights: [
      "Définir une politique qualité efficace",
      "Gérer les équipes qualité et sécurité alimentaire",
      "Piloter l'amélioration continue et gérer les crises"
    ],
    contactPerson: "Jean Dubois",
    contactEmail: "jean.dubois@ozego.fr",
    contactPhone: "01 34 56 78 90",
    detailedContent: [
      "Module 1: Élaboration et déploiement d'une politique qualité",
      "Module 2: Leadership et management des équipes qualité",
      "Module 3: Gestion des risques et prévention des crises",
      "Module 4: Communication interne et externe sur la qualité",
      "Module 5: Revue de direction et pilotage de l'amélioration continue",
      "Module 6: Études de cas et mises en situation"
    ],
    technicalSheetUrl: "https://example.com/fiche-technique-management-qualite.pdf"
  },
  {
    id: "5",
    title: "Audit d'hygiène en restauration collective",
    description: "Formation spécifique aux techniques d'audit d'hygiène pour les établissements de restauration collective.",
    type: "audit",
    level: "beginner",
    duration: 7,
    price: 650,
    pricingType: "fixed",
    instructor: "Claire Moreau",
    imageUrl: "https://images.unsplash.com/photo-1577301656505-bb9f8e245143?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    location: "Lille",
    maxParticipants: 20,
    createdAt: "2024-04-05T13:20:00.000Z",
    updatedAt: "2024-04-05T13:20:00.000Z",
    createdBy: "admin2",
    highlights: [
      "Maîtriser les bonnes pratiques d'hygiène en restauration collective",
      "Réaliser des audits d'hygiène efficaces",
      "Proposer des actions correctives adaptées"
    ],
    contactPerson: "Claire Moreau",
    contactEmail: "claire.moreau@ozego.fr",
    contactPhone: "01 56 78 90 12",
    detailedContent: [
      "Module 1: Réglementation applicable à la restauration collective",
      "Module 2: Bonnes pratiques d'hygiène et PRP",
      "Module 3: Méthodologie d'audit d'hygiène",
      "Module 4: Utilisation des outils d'évaluation",
      "Module 5: Restitution des résultats et plan d'action"
    ],
    technicalSheetUrl: "https://example.com/fiche-technique-audit-hygiene.pdf"
  }
];
