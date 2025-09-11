-- Update some thesis records to have demo PDF file URLs for testing
UPDATE public.theses 
SET file_url = '/demo-pdfs/sample-thesis-1.pdf'
WHERE title = 'Machine Learning Applications in Educational Technology';

UPDATE public.theses 
SET file_url = '/demo-pdfs/sample-thesis-2.pdf'
WHERE title = 'Sustainable Urban Planning Through Smart City Technologies';

UPDATE public.theses 
SET file_url = '/demo-pdfs/sample-thesis-1.pdf'
WHERE title = 'Blockchain Technology in Supply Chain Management';