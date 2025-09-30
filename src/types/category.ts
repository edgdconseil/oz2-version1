export type CategoryType = 'Alimentaire' | 'Non alimentaire';

export interface Family {
  id: string;
  name: string;
  category: CategoryType;
}

export interface SubFamily {
  id: string;
  name: string;
  category: CategoryType;
  familyId: string;
}
