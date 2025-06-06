
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
  
  // Campos calculados/relacionados
  title: string; // alias para titulo
  description: string; // alias para descricao
  imageUrl: string; // alias para imagem_url
  preparationTime: number; // alias para tempo_preparo
  servings: number; // alias para porcoes
  difficulty: string; // alias para dificuldade
  rating: number; // alias para nota_media
  
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
