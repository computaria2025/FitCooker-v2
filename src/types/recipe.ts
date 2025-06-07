
export interface Recipe {
  id: number;
  titulo: string;
  descricao: string;
  imagem_url: string;
  tempo_preparo: number;
  porcoes: number;
  dificuldade: string;
  nota_media: number;
  avaliacoes_count: number;
  created_at: string;
  usuario_id: string;
  
  // Campos calculados/relacionados para compatibilidade com componentes existentes
  title: string;
  description: string;
  imageUrl: string;
  preparationTime: number;
  servings: number;
  difficulty: string;
  rating: number;
  
  author: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  categories: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Category {
  id: number;
  nome: string;
  descricao: string;
  ativa: boolean;
}
