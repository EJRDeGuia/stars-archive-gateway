
-- Insert theses only if the thesis with the given id does not exist,
-- Use SELECT to lookup the correct college_id from colleges by name.

-- For each thesis, check if it exists using its unique id before inserting.
INSERT INTO theses (id, title, author, college_id, abstract, keywords, status, publish_date)
SELECT
  '11111111-0000-0000-0000-000000000001', 
  'Artificial Intelligence Applications in Educational Technology',
  'John Doe',
  (SELECT id FROM colleges WHERE name = 'CITE'),
  'This thesis explores the integration of artificial intelligence in educational technology, focusing on personalized learning experiences and automated assessment systems that can adapt to individual student needs.',
  ARRAY['AI', 'Educational Technology', 'Machine Learning', 'Personalized Learning'],
  'approved',
  '2023-03-01'
WHERE NOT EXISTS (
  SELECT 1 FROM theses WHERE id = '11111111-0000-0000-0000-000000000001'
);

INSERT INTO theses (id, title, author, college_id, abstract, keywords, status, publish_date)
SELECT
  '11111111-0000-0000-0000-000000000002', 
  'Blockchain Technology for Secure Academic Credential Verification',
  'Andrew Chen',
  (SELECT id FROM colleges WHERE name = 'CITE'),
  'This research proposes a blockchain-based system for secure verification of academic credentials, addressing the issues of credential fraud and verification inefficiencies in the digital age.',
  ARRAY['Blockchain', 'Cybersecurity', 'Academic Credentials', 'Digital Verification'],
  'approved',
  '2022-04-28'
WHERE NOT EXISTS (
  SELECT 1 FROM theses WHERE id = '11111111-0000-0000-0000-000000000002'
);

INSERT INTO theses (id, title, author, college_id, abstract, keywords, status, publish_date)
SELECT
  '11111111-0000-0000-0000-000000000003', 
  'Impact of Digital Marketing Strategies on SMEs in the Philippines',
  'Maria Santos',
  (SELECT id FROM colleges WHERE name = 'CBEAM'),
  'This study analyzes how various digital marketing strategies affect the performance of small and medium-sized enterprises in the Philippines during the post-pandemic period.',
  ARRAY['Digital Marketing', 'SMEs', 'Business Strategy', 'Philippines Economy'],
  'approved',
  '2023-02-16'
WHERE NOT EXISTS (
  SELECT 1 FROM theses WHERE id = '11111111-0000-0000-0000-000000000003'
);

INSERT INTO theses (id, title, author, college_id, abstract, keywords, status, publish_date)
SELECT
  '11111111-0000-0000-0000-000000000004', 
  'Sustainable Business Models in the Circular Economy',
  'Elena Rodriguez',
  (SELECT id FROM colleges WHERE name = 'CBEAM'),
  'An examination of sustainable business practices and models that embrace circular economy principles to reduce waste and improve resource utilization.',
  ARRAY['Sustainability', 'Circular Economy', 'Business Models', 'Environmental Impact'],
  'approved',
  '2021-09-11'
WHERE NOT EXISTS (
  SELECT 1 FROM theses WHERE id = '11111111-0000-0000-0000-000000000004'
);

INSERT INTO theses (id, title, author, college_id, abstract, keywords, status, publish_date)
SELECT
  '11111111-0000-0000-0000-000000000005',
  'Innovative Pedagogical Approaches in Literature Education',
  'Patricia Reyes',
  (SELECT id FROM colleges WHERE name = 'CEAS'),
  'This research investigates innovative teaching methodologies and their effectiveness in enhancing student engagement and comprehension in literature courses.',
  ARRAY['Pedagogy', 'Literature', 'Education', 'Teaching Methods'],
  'pending_review',
  '2022-07-08'
WHERE NOT EXISTS (
  SELECT 1 FROM theses WHERE id = '11111111-0000-0000-0000-000000000005'
);

INSERT INTO theses (id, title, author, college_id, abstract, keywords, status, publish_date)
SELECT
  '11111111-0000-0000-0000-000000000006',
  'Mental Health Support Systems in Academic Institutions',
  'Dr. Sarah Wilson',
  (SELECT id FROM colleges WHERE name = 'CON'),
  'A comprehensive study on the effectiveness of mental health support systems in academic institutions and their impact on student wellbeing and academic performance.',
  ARRAY['Mental Health', 'Student Wellbeing', 'Healthcare', 'Academic Performance'],
  'approved',
  '2023-05-20'
WHERE NOT EXISTS (
  SELECT 1 FROM theses WHERE id = '11111111-0000-0000-0000-000000000006'
);

INSERT INTO theses (id, title, author, college_id, abstract, keywords, status, publish_date)
SELECT
  '11111111-0000-0000-0000-000000000007',
  'Sustainable Tourism Practices in Southeast Asia',
  'Marco Tan',
  (SELECT id FROM colleges WHERE name = 'CIHTM'),
  'This thesis examines sustainable tourism practices in Southeast Asia and their impact on local communities, economy, and environmental conservation.',
  ARRAY['Sustainable Tourism', 'Southeast Asia', 'Environmental Conservation', 'Community Impact'],
  'approved',
  '2022-11-15'
WHERE NOT EXISTS (
  SELECT 1 FROM theses WHERE id = '11111111-0000-0000-0000-000000000007'
);
