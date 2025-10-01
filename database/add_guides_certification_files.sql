-- Add certification_files column to guides table
ALTER TABLE public.guides
  ADD COLUMN IF NOT EXISTS certification_files text[] DEFAULT ARRAY[]::text[];

-- Index for array length queries (optional)
CREATE INDEX IF NOT EXISTS idx_guides_certification_files_gin ON public.guides USING GIN (certification_files);


