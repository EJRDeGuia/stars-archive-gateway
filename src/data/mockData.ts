
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

export const mockTheses = [
  {
    id: '1',
    title: 'Artificial Intelligence Applications in Educational Technology',
    authors: ['John Doe', 'Jane Smith'],
    collegeId: '1',
    year: 2023,
    abstract: 'This thesis explores the integration of artificial intelligence in educational technology, focusing on personalized learning experiences and automated assessment systems.',
    tags: ['AI', 'Educational Technology', 'Machine Learning'],
    approved: true
  },
  {
    id: '2',
    title: 'Blockchain Technology for Secure Academic Credential Verification',
    authors: ['Andrew Chen', 'Sophia Dela Cruz'],
    collegeId: '1',
    year: 2022,
    abstract: 'This research proposes a blockchain-based system for secure verification of academic credentials, addressing the issues of credential fraud and verification inefficiencies.',
    tags: ['Blockchain', 'Cybersecurity', 'Academic Credentials'],
    approved: true
  },
  {
    id: '3',
    title: 'Impact of Digital Marketing Strategies on SMEs in the Philippines',
    authors: ['Maria Santos', 'Robert Tan'],
    collegeId: '2',
    year: 2023,
    abstract: 'This study analyzes how various digital marketing strategies affect the performance of small and medium-sized enterprises in the Philippines during the post-pandemic period.',
    tags: ['Digital Marketing', 'SMEs', 'Business Strategy'],
    approved: true
  },
  {
    id: '4',
    title: 'Sustainable Business Models in the Circular Economy',
    authors: ['Elena Rodriguez', 'Michael Chang'],
    collegeId: '2',
    year: 2021,
    abstract: 'An examination of sustainable business practices and models that embrace circular economy principles to reduce waste and improve resource utilization.',
    tags: ['Sustainability', 'Circular Economy', 'Business Models'],
    approved: true
  },
  {
    id: '5',
    title: 'Innovative Pedagogical Approaches in Literature Education',
    authors: ['Patricia Reyes', 'Daniel Mendoza'],
    collegeId: '3',
    year: 2022,
    abstract: 'This research investigates innovative teaching methodologies and their effectiveness in enhancing student engagement and comprehension in literature courses.',
    tags: ['Pedagogy', 'Literature', 'Education'],
    approved: false
  }
];
