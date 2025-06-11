
-- Criar tabela para armazenar múltiplas mídias das receitas
CREATE TABLE public.receita_midias (
  id SERIAL PRIMARY KEY,
  receita_id INTEGER NOT NULL REFERENCES public.receitas(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('image', 'video')),
  is_principal BOOLEAN DEFAULT FALSE,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_receita_midias_receita_id ON public.receita_midias(receita_id);
CREATE INDEX idx_receita_midias_principal ON public.receita_midias(receita_id, is_principal);

-- Habilitar RLS
ALTER TABLE public.receita_midias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver mídias de receitas públicas" ON public.receita_midias
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem inserir mídias em suas próprias receitas" ON public.receita_midias
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.receitas 
      WHERE id = receita_id AND usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar mídias de suas próprias receitas" ON public.receita_midias
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.receitas 
      WHERE id = receita_id AND usuario_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem deletar mídias de suas próprias receitas" ON public.receita_midias
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.receitas 
      WHERE id = receita_id AND usuario_id = auth.uid()
    )
  );

-- Criar bucket de storage para mídias de receitas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-media',
  'recipe-media',
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
);

-- Políticas para o bucket de storage
CREATE POLICY "Qualquer um pode ver mídias de receitas" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipe-media');

CREATE POLICY "Usuários autenticados podem fazer upload de mídias" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recipe-media' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Usuários podem atualizar suas próprias mídias" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'recipe-media' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Usuários podem deletar suas próprias mídias" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recipe-media' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
