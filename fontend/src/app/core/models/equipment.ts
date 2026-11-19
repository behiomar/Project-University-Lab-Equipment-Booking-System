export interface Equipment {
  id: number;
  name: string;
  category: string;
  description: string;
  image?: string | null;
  quantity: number;
  status: string;
}