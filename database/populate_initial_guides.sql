-- Insert initial guides data
-- This script populates the guides table with the mock data from the guides page

INSERT INTO guides (
  id,
  user_id,
  name,
  email,
  phone,
  avatar,
  location,
  member_since,
  description,
  specialties,
  languages,
  experience_years,
  certifications,
  rating,
  total_reviews,
  completed_activities,
  is_verified,
  is_active
) VALUES 
-- Carlos Montaña
(
  gen_random_uuid(),
  'carlos-montaña-user-id', -- This would be a real user_id in production
  'Carlos Montaña',
  'carlos.montana@example.com',
  '+54 9 294 123-4567',
  '/placeholder.svg',
  'Bariloche, Centro',
  '2020-01-15T00:00:00Z',
  'Guía de montaña certificado con experiencia en los Andes Patagónicos. Especializado en trekking, escalada y montañismo.',
  ARRAY['Trekking', 'Escalada', 'Montañismo'],
  ARRAY['Español', 'Inglés'],
  10,
  ARRAY['Guía AAGM', 'Primeros Auxilios WFR'],
  4.8,
  124,
  8,
  true,
  true
),

-- Laura Ríos
(
  gen_random_uuid(),
  'laura-rios-user-id',
  'Laura Ríos',
  'laura.rios@example.com',
  '+54 9 294 234-5678',
  '/placeholder.svg',
  'Bariloche, Llao Llao',
  '2021-03-20T00:00:00Z',
  'Especialista en actividades acuáticas. Instructora de kayak y guía de pesca con mosca certificada.',
  ARRAY['Kayak', 'Rafting', 'Pesca'],
  ARRAY['Español', 'Inglés', 'Portugués'],
  8,
  ARRAY['Instructora Kayak', 'Guía de Pesca'],
  4.9,
  87,
  5,
  true,
  true
),

-- Martín Escalante
(
  gen_random_uuid(),
  'martin-escalante-user-id',
  'Martín Escalante',
  'martin.escalante@example.com',
  '+54 9 294 345-6789',
  '/placeholder.svg',
  'Bariloche, Catedral',
  '2019-06-10T00:00:00Z',
  'Instructor de escalada con experiencia internacional. Especializado en rutas de dificultad media y alta.',
  ARRAY['Escalada', 'Rappel', 'Trekking'],
  ARRAY['Español', 'Inglés', 'Francés'],
  12,
  ARRAY['EPGAMT', 'UIAA'],
  4.7,
  56,
  6,
  true,
  true
),

-- Ana Gutiérrez
(
  gen_random_uuid(),
  'ana-gutierrez-user-id',
  'Ana Gutiérrez',
  'ana.gutierrez@example.com',
  '+54 9 294 456-7890',
  '/placeholder.svg',
  'Bariloche, Campanario',
  '2022-02-14T00:00:00Z',
  'Guía especializada en turismo fotográfico y observación de aves. Conocedora de la flora y fauna local.',
  ARRAY['Trekking', 'Fotografía', 'Observación de aves'],
  ARRAY['Español', 'Inglés'],
  7,
  ARRAY['Guía de Turismo', 'Fotografía Naturaleza'],
  4.9,
  156,
  9,
  true,
  true
),

-- Roberto Pescador
(
  gen_random_uuid(),
  'roberto-pescador-user-id',
  'Roberto Pescador',
  'roberto.pescador@example.com',
  '+54 9 294 567-8901',
  '/placeholder.svg',
  'Bariloche, Río Limay',
  '2018-09-05T00:00:00Z',
  'Experto en pesca con mosca en ríos y lagos patagónicos. Instructor certificado de fly casting.',
  ARRAY['Pesca con mosca', 'Fly casting', 'Navegación'],
  ARRAY['Español', 'Inglés'],
  15,
  ARRAY['Guía de Pesca', 'Navegación'],
  5.0,
  42,
  3,
  true,
  true
),

-- Javier Nieves
(
  gen_random_uuid(),
  'javier-nieves-user-id',
  'Javier Nieves',
  'javier.nieves@example.com',
  '+54 9 294 678-9012',
  '/placeholder.svg',
  'Bariloche, Catedral',
  '2020-11-30T00:00:00Z',
  'Instructor de esquí y snowboard. Especialista en actividades invernales y seguridad en montaña.',
  ARRAY['Esquí', 'Snowboard', 'Raquetas de nieve'],
  ARRAY['Español', 'Inglés', 'Alemán'],
  9,
  ARRAY['AADIDESS', 'Avalanche Safety'],
  4.9,
  112,
  7,
  true,
  true
),

-- Pedro Rodríguez
(
  gen_random_uuid(),
  'pedro-rodriguez-user-id',
  'Pedro Rodríguez',
  'pedro.rodriguez@example.com',
  '+54 9 294 789-0123',
  '/placeholder.svg',
  'Bariloche, Circuito Chico',
  '2021-07-18T00:00:00Z',
  'Guía multiaventura especializado en recorridos en bicicleta y vuelos en parapente.',
  ARRAY['Bicicleta', 'Trekking', 'Parapente'],
  ARRAY['Español', 'Inglés', 'Italiano'],
  6,
  ARRAY['MTB Guide', 'Parapente Tandem'],
  4.7,
  92,
  10,
  true,
  true
),

-- Sofía Montañez
(
  gen_random_uuid(),
  'sofia-montanez-user-id',
  'Sofía Montañez',
  'sofia.montanez@example.com',
  '+54 9 294 890-1234',
  '/placeholder.svg',
  'Bariloche, Villa Catedral',
  '2022-04-12T00:00:00Z',
  'Instructora de yoga y guía de trekking. Especializada en experiencias de bienestar en la naturaleza.',
  ARRAY['Yoga en montaña', 'Trekking', 'Meditación'],
  ARRAY['Español', 'Inglés'],
  5,
  ARRAY['Yoga Alliance', 'Guía de Trekking'],
  4.8,
  78,
  4,
  true,
  true
);

-- Create some sample activities for these guides
-- First, let's create some sample activities (you'll need to adjust these based on your activities table structure)
-- Note: This assumes you have an 'activities' table. Adjust the activity_id values based on your actual activities.

-- Sample guide_activities entries (you'll need to adjust the activity_id values)
-- These are placeholder activity IDs - replace with actual activity IDs from your activities table

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'trekking-catedral', -- Replace with actual activity ID
  15000,
  8,
  true
FROM guides g 
WHERE g.name = 'Carlos Montaña';

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'kayak-gutierrez', -- Replace with actual activity ID
  12000,
  6,
  true
FROM guides g 
WHERE g.name = 'Laura Ríos';

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'escalada-piedras-blancas', -- Replace with actual activity ID
  18000,
  4,
  true
FROM guides g 
WHERE g.name = 'Martín Escalante';

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'fotografia-naturaleza', -- Replace with actual activity ID
  10000,
  10,
  true
FROM guides g 
WHERE g.name = 'Ana Gutiérrez';

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'pesca-mosca', -- Replace with actual activity ID
  20000,
  4,
  true
FROM guides g 
WHERE g.name = 'Roberto Pescador';

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'esqui-catedral', -- Replace with actual activity ID
  22000,
  6,
  true
FROM guides g 
WHERE g.name = 'Javier Nieves';

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'bike-circuito-chico', -- Replace with actual activity ID
  9000,
  8,
  true
FROM guides g 
WHERE g.name = 'Pedro Rodríguez';

INSERT INTO guide_activities (guide_id, activity_id, price, max_participants, is_available)
SELECT 
  g.id,
  'yoga-montana', -- Replace with actual activity ID
  8000,
  12,
  true
FROM guides g 
WHERE g.name = 'Sofía Montañez';

-- Create some sample reviews for these guides
-- Note: These use placeholder user IDs - replace with actual user IDs in production

INSERT INTO reviews (guide_id, user_id, activity_id, rating, comment, user_name, user_avatar)
SELECT 
  g.id,
  'sample-user-1',
  'trekking-catedral',
  5,
  'Excelente guía, muy profesional y conocedor de la zona. La experiencia fue increíble.',
  'María González',
  '/placeholder.svg'
FROM guides g 
WHERE g.name = 'Carlos Montaña';

INSERT INTO reviews (guide_id, user_id, activity_id, rating, comment, user_name, user_avatar)
SELECT 
  g.id,
  'sample-user-2',
  'kayak-gutierrez',
  5,
  'Laura es una excelente instructora. Muy paciente y con gran conocimiento técnico.',
  'Juan Pérez',
  '/placeholder.svg'
FROM guides g 
WHERE g.name = 'Laura Ríos';

INSERT INTO reviews (guide_id, user_id, activity_id, rating, comment, user_name, user_avatar)
SELECT 
  g.id,
  'sample-user-3',
  'escalada-piedras-blancas',
  4,
  'Muy buena experiencia, Martín es muy seguro y profesional.',
  'Carlos Silva',
  '/placeholder.svg'
FROM guides g 
WHERE g.name = 'Martín Escalante';

-- Add a few more sample reviews
INSERT INTO reviews (guide_id, user_id, activity_id, rating, comment, user_name, user_avatar)
SELECT 
  g.id,
  'sample-user-4',
  'fotografia-naturaleza',
  5,
  'Ana es increíble, aprendí mucho sobre fotografía y la naturaleza local.',
  'Ana Martínez',
  '/placeholder.svg'
FROM guides g 
WHERE g.name = 'Ana Gutiérrez';

INSERT INTO reviews (guide_id, user_id, activity_id, rating, comment, user_name, user_avatar)
SELECT 
  g.id,
  'sample-user-5',
  'pesca-mosca',
  5,
  'Roberto es un maestro de la pesca con mosca. Una experiencia única.',
  'Roberto López',
  '/placeholder.svg'
FROM guides g 
WHERE g.name = 'Roberto Pescador';
