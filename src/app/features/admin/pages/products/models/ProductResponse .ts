export interface ProductResponse {
  id: number;
  name: string;
  description: string;   
  price: number;
  isAvailable: boolean;
  imageUrl: string;
  categoryId: number;    
  categoryName: string;  
  createdAt: string;
  updatedAt: string;
}