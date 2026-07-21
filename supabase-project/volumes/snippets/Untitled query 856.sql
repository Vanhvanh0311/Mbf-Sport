INSERT INTO public.sports (name, name_en, icon, description) 
VALUES ('Cầu lông', 'Badminton', 'badminton-icon', 'Môn thể thao cầu lông đơn và đôi')
ON CONFLICT (name) DO NOTHING;
