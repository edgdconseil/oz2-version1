
import { Product } from "@/types";

/**
 * Génère une référence unique pour un produit
 */
export const generateReference = (productName: string): string => {
  // Prendre les 3 premiers caractères du nom et ajouter un timestamp
  const prefix = productName.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().substring(8);
  return `${prefix}-${timestamp}`;
};

/**
 * Transforme une ligne Excel en objet produit
 */
export const excelRowToProduct = (row: any): Partial<Product> => {
  // Conversion de chaînes "Oui"/"Non" en booléens
  const isOrganic = row["Biologique"] === "Oui";
  const available = row["Disponibilité"] === "Disponible";
  
  // Conversion de la catégorie
  const category = row["Catégorie"] === "Alimentaire" ? "food" : "non-food";
  
  // Conversion du prix en nombre (supprimer le symbole € et convertir en nombre)
  const priceHT = parseFloat(row["Prix HT"].toString().replace(/[^\d.,]/g, '').replace(',', '.'));
  
  // Conversion du poids en nombre
  const weight = parseFloat(row["Poids"].toString().replace(/[^\d.,]/g, '').replace(',', '.'));
  
  // Conversion du taux de TVA (retirer le symbole %)
  const vatRateStr = row["Taux TVA"].toString().replace('%', '').trim();
  const vatRate = parseFloat(vatRateStr);

  return {
    reference: row["Référence"],
    name: row["Nom"],
    category,
    priceHT,
    weight,
    origin: row["Origine"],
    isOrganic,
    supplierName: row["Fournisseur"],
    available,
    packagingUnit: row["Unité"],
    vatRate
  };
};
