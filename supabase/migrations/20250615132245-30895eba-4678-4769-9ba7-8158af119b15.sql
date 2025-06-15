
-- Delete any dependencies first due to foreign key relations
DELETE FROM thesis_views WHERE thesis_id IN (SELECT id FROM theses);
DELETE FROM thesis_downloads WHERE thesis_id IN (SELECT id FROM theses);
DELETE FROM user_favorites WHERE thesis_id IN (SELECT id FROM theses);
DELETE FROM collection_theses WHERE thesis_id IN (SELECT id FROM theses);

-- Now delete all theses
DELETE FROM theses;
