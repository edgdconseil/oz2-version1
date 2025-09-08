
// Updated types for Training Courses
export type TrainingType = 'audit' | 'consulting' | 'certification' | 'management';
export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced';
export type PricingType = 'fixed' | 'from' | 'quote';

export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  type: TrainingType;
  level: TrainingLevel;
  duration: number; // In hours
  price: number;
  pricingType: PricingType; // Type de tarification
  instructor: string;
  imageUrl?: string;
  location: string;
  dateStart?: string;
  dateEnd?: string;
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  highlights: string[]; // Key points about the training
  // New fields
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  detailedContent: string[];
  technicalSheetUrl?: string;
}

// New types for callback requests
export interface CallbackRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  trainingId: string;
  trainingTitle: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed';
  createdAt: string;
}
