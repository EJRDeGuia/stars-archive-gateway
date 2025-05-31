
import { GraduationCap, BookOpen, Building, PenTool, HeartPulse } from 'lucide-react';

export const colleges = [
  {
    id: '1',
    name: 'CITE',
    fullName: 'College of Information Technology & Engineering',
    description: 'Focuses on engineering and IT-related studies.',
    thesesCount: 120,
    color: 'red',
    icon: GraduationCap,
    since: '2020'
  },
  {
    id: '2',
    name: 'CBEAM',
    fullName: 'College of Business, Economics, Accountancy & Management',
    description: 'Dedicated to business and financial disciplines.',
    thesesCount: 145,
    color: 'yellow',
    icon: Building,
    since: '2020'
  },
  {
    id: '3',
    name: 'CEAS',
    fullName: 'College of Education, Arts & Sciences',
    description: 'Covers educational, artistic, and scientific research areas.',
    thesesCount: 168,
    color: 'blue',
    icon: BookOpen,
    since: '2020'
  },
  {
    id: '4',
    name: 'CON',
    fullName: 'College of Nursing',
    description: 'Pertains to nursing and healthcare-focused research.',
    thesesCount: 94,
    color: 'gray',
    icon: HeartPulse,
    since: '2020'
  },
  {
    id: '5',
    name: 'CIHTM',
    fullName: 'College of International Hospitality and Tourism Management',
    description: 'Highlights hospitality and tourism studies.',
    thesesCount: 87,
    color: 'green',
    icon: Building,
    since: '2020'
  }
];

export const theses = [
  {
    id: '1',
    title: 'Artificial Intelligence Applications in Educational Technology',
    author: 'John Doe',
    college: 'CITE',
    year: 2023,
    abstract: 'This thesis explores the integration of artificial intelligence in educational technology, focusing on personalized learning experiences and automated assessment systems that can adapt to individual student needs.',
    keywords: ['AI', 'Educational Technology', 'Machine Learning', 'Personalized Learning'],
    approved: true
  },
  {
    id: '2',
    title: 'Blockchain Technology for Secure Academic Credential Verification',
    author: 'Andrew Chen',
    college: 'CITE',
    year: 2022,
    abstract: 'This research proposes a blockchain-based system for secure verification of academic credentials, addressing the issues of credential fraud and verification inefficiencies in the digital age.',
    keywords: ['Blockchain', 'Cybersecurity', 'Academic Credentials', 'Digital Verification'],
    approved: true
  },
  {
    id: '3',
    title: 'Impact of Digital Marketing Strategies on SMEs in the Philippines',
    author: 'Maria Santos',
    college: 'CBEAM',
    year: 2023,
    abstract: 'This study analyzes how various digital marketing strategies affect the performance of small and medium-sized enterprises in the Philippines during the post-pandemic period.',
    keywords: ['Digital Marketing', 'SMEs', 'Business Strategy', 'Philippines Economy'],
    approved: true
  },
  {
    id: '4',
    title: 'Sustainable Business Models in the Circular Economy',
    author: 'Elena Rodriguez',
    college: 'CBEAM',
    year: 2021,
    abstract: 'An examination of sustainable business practices and models that embrace circular economy principles to reduce waste and improve resource utilization.',
    keywords: ['Sustainability', 'Circular Economy', 'Business Models', 'Environmental Impact'],
    approved: true
  },
  {
    id: '5',
    title: 'Innovative Pedagogical Approaches in Literature Education',
    author: 'Patricia Reyes',
    college: 'CEAS',
    year: 2022,
    abstract: 'This research investigates innovative teaching methodologies and their effectiveness in enhancing student engagement and comprehension in literature courses.',
    keywords: ['Pedagogy', 'Literature', 'Education', 'Teaching Methods'],
    approved: false
  },
  {
    id: '6',
    title: 'Mental Health Support Systems in Academic Institutions',
    author: 'Dr. Sarah Wilson',
    college: 'CON',
    year: 2023,
    abstract: 'A comprehensive study on the effectiveness of mental health support systems in academic institutions and their impact on student wellbeing and academic performance.',
    keywords: ['Mental Health', 'Student Wellbeing', 'Healthcare', 'Academic Performance'],
    approved: true
  },
  {
    id: '7',
    title: 'Sustainable Tourism Practices in Southeast Asia',
    author: 'Marco Tan',
    college: 'CIHTM',
    year: 2022,
    abstract: 'This thesis examines sustainable tourism practices in Southeast Asia and their impact on local communities, economy, and environmental conservation.',
    keywords: ['Sustainable Tourism', 'Southeast Asia', 'Environmental Conservation', 'Community Impact'],
    approved: true
  }
];

export const mockTheses = theses; // Keep for backward compatibility
