-- Add sample thesis data for testing AI recommendations and semantic search
INSERT INTO public.theses (title, author, abstract, keywords, status, college_id, publish_date, view_count) VALUES
('Machine Learning Applications in Educational Technology', 'Maria Santos', 'This thesis explores the integration of machine learning algorithms in educational platforms to enhance personalized learning experiences. The study demonstrates how adaptive learning systems can improve student engagement and academic performance through intelligent content recommendation and progress tracking.', '{"machine learning", "education", "adaptive learning", "personalization", "AI"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-11-15', 45),

('Sustainable Urban Planning Through Smart City Technologies', 'Juan Rodriguez', 'An investigation into how Internet of Things (IoT) devices and big data analytics can transform urban planning practices. This research presents a comprehensive framework for implementing smart city solutions that prioritize environmental sustainability and citizen welfare.', '{"smart cities", "IoT", "urban planning", "sustainability", "big data"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-10-20', 67),

('Blockchain Technology in Supply Chain Management', 'Ana Reyes', 'This study examines the implementation of blockchain technology to enhance transparency and traceability in global supply chains. The research provides insights into how distributed ledger technology can reduce fraud, improve efficiency, and build trust among stakeholders.', '{"blockchain", "supply chain", "transparency", "distributed ledger", "logistics"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-09-08', 89),

('Mental Health Support Systems in Remote Work Environments', 'Carlos Mendoza', 'An analysis of digital mental health interventions and their effectiveness in supporting remote workers. This thesis presents evidence-based strategies for organizations to maintain employee wellbeing in distributed work settings through technology-enabled solutions.', '{"mental health", "remote work", "digital health", "employee wellbeing", "telemedicine"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2024-01-12', 34),

('Renewable Energy Integration in Developing Countries', 'Sofia Gutierrez', 'This research explores sustainable energy solutions tailored for developing nations, focusing on solar and wind power implementation. The study addresses technical, economic, and social challenges while proposing innovative financing models for clean energy adoption.', '{"renewable energy", "solar power", "wind energy", "developing countries", "sustainability"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-12-05', 78),

('Artificial Intelligence in Medical Diagnosis Systems', 'Miguel Torres', 'An investigation into AI-powered diagnostic tools and their impact on healthcare delivery. This thesis evaluates the accuracy, reliability, and ethical implications of machine learning models in medical decision-making processes.', '{"artificial intelligence", "medical diagnosis", "healthcare AI", "machine learning", "ethics"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-08-22', 92),

('Cybersecurity Frameworks for Small and Medium Enterprises', 'Isabella Cruz', 'This study develops practical cybersecurity frameworks specifically designed for SMEs with limited resources. The research provides cost-effective security strategies and risk assessment methodologies to protect small businesses from cyber threats.', '{"cybersecurity", "SME security", "risk assessment", "information security", "cyber threats"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2024-02-18', 56),

('Social Media Impact on Consumer Behavior and Brand Loyalty', 'Diego Herrera', 'An empirical analysis of how social media platforms influence purchasing decisions and brand relationships. This thesis examines consumer engagement patterns and develops strategies for businesses to build authentic connections with their audiences.', '{"social media", "consumer behavior", "brand loyalty", "digital marketing", "engagement"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-07-30', 73),

('Climate Change Adaptation Strategies in Coastal Communities', 'Lucia Morales', 'This research investigates community-based adaptation approaches to sea-level rise and extreme weather events. The study presents innovative solutions for coastal resilience and sustainable development in vulnerable maritime regions.', '{"climate change", "coastal adaptation", "sea level rise", "community resilience", "environmental science"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-11-28', 41),

('Virtual Reality Applications in Therapy and Rehabilitation', 'Roberto Jimenez', 'An exploration of VR technology in medical rehabilitation and psychological therapy. This thesis demonstrates how immersive environments can enhance treatment outcomes for patients with physical disabilities and mental health conditions.', '{"virtual reality", "medical rehabilitation", "therapy", "immersive technology", "healthcare innovation"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2024-01-25', 38),

('Data Privacy and GDPR Compliance in Cloud Computing', 'Camila Vargas', 'This study examines data protection challenges in cloud environments and provides comprehensive GDPR compliance frameworks. The research addresses privacy-by-design principles and proposes technical solutions for secure data processing.', '{"data privacy", "GDPR", "cloud computing", "privacy by design", "data protection"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-09-14', 64),

('E-commerce Platform Optimization Through User Experience Design', 'Fernando Lopez', 'An investigation into UX design principles that drive e-commerce success. This thesis provides evidence-based recommendations for improving online shopping experiences and increasing conversion rates through user-centered design approaches.', '{"e-commerce", "user experience", "UX design", "conversion optimization", "web design"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-10-11', 85),

('Financial Technology Innovation in Emerging Markets', 'Valentina Ruiz', 'This research explores fintech solutions addressing financial inclusion challenges in emerging economies. The study analyzes mobile payment systems, microfinance platforms, and digital banking innovations that serve underbanked populations.', '{"fintech", "financial inclusion", "mobile payments", "emerging markets", "digital banking"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2024-03-02', 47),

('Autonomous Vehicle Safety Systems and Ethical Considerations', 'Andres Castro', 'An examination of safety technologies in autonomous vehicles and the ethical dilemmas they present. This thesis addresses decision-making algorithms, liability issues, and public acceptance challenges in self-driving car deployment.', '{"autonomous vehicles", "safety systems", "ethics", "self-driving cars", "transportation technology"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-06-18', 76),

('Agricultural Technology and Food Security in the 21st Century', 'Patricia Flores', 'This study investigates precision agriculture techniques and their role in addressing global food security challenges. The research evaluates drone technology, IoT sensors, and AI-driven crop management systems for sustainable farming practices.', '{"precision agriculture", "food security", "agricultural technology", "IoT", "sustainable farming"}', 'approved', (SELECT id FROM colleges LIMIT 1), '2023-12-20', 52);

-- Add sample thesis views for personalized recommendations
INSERT INTO public.thesis_views (thesis_id, user_id, viewed_at) 
SELECT 
  t.id as thesis_id,
  ur.user_id,
  NOW() - (random() * interval '30 days') as viewed_at
FROM public.theses t
CROSS JOIN (SELECT user_id FROM public.user_roles LIMIT 3) ur
WHERE random() < 0.4; -- 40% chance each user viewed each thesis

-- Update system statistics
SELECT update_system_statistics();