
export interface College {
  id: string;
  name: string;
  fullName: string;
  description: string;
  color: string;
  thesesCount: number;
}

export interface Thesis {
  id: string;
  title: string;
  author: string;
  coAuthor?: string;
  college: string;
  department: string;
  year: number;
  abstract: string;
  keywords: string[];
  dateSubmitted: string;
  advisor: string;
  pages: number;
}

export const colleges: College[] = [
  {
    id: 'cite',
    name: 'CITE',
    fullName: 'College of Information Technology & Engineering',
    description: 'Advancing technology and engineering solutions for the digital age',
    color: 'bg-blue-500',
    thesesCount: 234
  },
  {
    id: 'cbeam',
    name: 'CBEAM',
    fullName: 'College of Business, Economics, Accountancy & Management',
    description: 'Fostering business leadership and economic innovation',
    color: 'bg-green-500',
    thesesCount: 187
  },
  {
    id: 'ceas',
    name: 'CEAS',
    fullName: 'College of Education, Arts & Sciences',
    description: 'Nurturing educators and liberal arts scholars',
    color: 'bg-purple-500',
    thesesCount: 156
  },
  {
    id: 'cihtm',
    name: 'CIHTM',
    fullName: 'College of International Hospitality and Tourism Management',
    description: 'Excellence in hospitality and tourism education',
    color: 'bg-orange-500',
    thesesCount: 89
  },
  {
    id: 'con',
    name: 'CON',
    fullName: 'College of Nursing',
    description: 'Developing compassionate healthcare professionals',
    color: 'bg-red-500',
    thesesCount: 112
  }
];

export const mockTheses: Thesis[] = [
  // CITE Theses
  {
    id: '1',
    title: 'Machine Learning Approaches for Automated Code Review in Software Development',
    author: 'Rodriguez, Maria Elena',
    coAuthor: 'Santos, John Michael',
    college: 'cite',
    department: 'Computer Science',
    year: 2024,
    abstract: 'This study explores the application of machine learning algorithms in automating code review processes. The research presents a comprehensive analysis of various ML models including Random Forest, Support Vector Machines, and Neural Networks for identifying code quality issues, security vulnerabilities, and performance bottlenecks in software projects.',
    keywords: ['Machine Learning', 'Code Review', 'Software Quality', 'Automation', 'Neural Networks'],
    dateSubmitted: '2024-03-15',
    advisor: 'Dr. Patricia Lim',
    pages: 89
  },
  {
    id: '2',
    title: 'IoT-Based Smart Campus Management System for Educational Institutions',
    author: 'Chen, Wei Lin',
    college: 'cite',
    department: 'Information Technology',
    year: 2024,
    abstract: 'Development of an integrated IoT solution for managing campus resources including smart lighting, climate control, security systems, and student attendance tracking. The system demonstrates significant energy savings and improved operational efficiency.',
    keywords: ['IoT', 'Smart Campus', 'Energy Management', 'Automation', 'Sustainability'],
    dateSubmitted: '2024-02-28',
    advisor: 'Prof. Robert Cruz',
    pages: 95
  },
  // CBEAM Theses
  {
    id: '3',
    title: 'Digital Transformation Strategies for Small and Medium Enterprises in the Philippines',
    author: 'Dela Cruz, Ana Marie',
    college: 'cbeam',
    department: 'Business Administration',
    year: 2024,
    abstract: 'An analysis of digital transformation challenges and opportunities faced by SMEs in the Philippines. The study provides a framework for successful digital adoption and examines the impact on business performance and competitiveness.',
    keywords: ['Digital Transformation', 'SMEs', 'Business Strategy', 'Philippines', 'Technology Adoption'],
    dateSubmitted: '2024-04-10',
    advisor: 'Dr. Benjamin Ramos',
    pages: 78
  },
  {
    id: '4',
    title: 'Sustainable Supply Chain Management Practices in the Food Industry',
    author: 'Villanueva, Carlos Eduardo',
    coAuthor: 'Morales, Lisa Grace',
    college: 'cbeam',
    department: 'Management',
    year: 2023,
    abstract: 'Investigation of sustainable practices in food supply chains, focusing on waste reduction, ethical sourcing, and environmental impact. The research proposes a sustainability assessment framework for food companies.',
    keywords: ['Supply Chain', 'Sustainability', 'Food Industry', 'Environmental Impact', 'Waste Management'],
    dateSubmitted: '2023-11-20',
    advisor: 'Prof. Margaret Torres',
    pages: 102
  },
  // CEAS Theses
  {
    id: '5',
    title: 'Effectiveness of Gamification in Elementary Mathematics Education',
    author: 'Garcia, Joy Anne',
    college: 'ceas',
    department: 'Elementary Education',
    year: 2024,
    abstract: 'A comprehensive study on the impact of gamification techniques on student engagement and learning outcomes in elementary mathematics. The research includes experimental design with control and treatment groups across multiple schools.',
    keywords: ['Gamification', 'Mathematics Education', 'Elementary Education', 'Student Engagement', 'Learning Outcomes'],
    dateSubmitted: '2024-01-25',
    advisor: 'Dr. Sofia Mendoza',
    pages: 67
  },
  // CIHTM Theses
  {
    id: '6',
    title: 'Impact of Social Media Marketing on Tourist Destination Choice in Batangas Province',
    author: 'Reyes, Mark Anthony',
    college: 'cihtm',
    department: 'Tourism Management',
    year: 2024,
    abstract: 'Analysis of how social media platforms influence tourist decision-making processes when choosing destinations in Batangas. The study examines the effectiveness of different social media strategies in promoting local tourism.',
    keywords: ['Social Media Marketing', 'Tourism', 'Destination Marketing', 'Batangas', 'Tourist Behavior'],
    dateSubmitted: '2024-03-05',
    advisor: 'Prof. Elena Castillo',
    pages: 84
  },
  // CON Theses
  {
    id: '7',
    title: 'Mental Health Support Systems for Healthcare Workers During Pandemic Response',
    author: 'Aquino, Christine Mae',
    college: 'con',
    department: 'Nursing',
    year: 2024,
    abstract: 'A qualitative study examining the mental health challenges faced by healthcare workers during the COVID-19 pandemic and evaluating the effectiveness of various support interventions implemented in Philippine hospitals.',
    keywords: ['Mental Health', 'Healthcare Workers', 'Pandemic', 'Support Systems', 'Nursing'],
    dateSubmitted: '2024-02-14',
    advisor: 'Dr. Rosario Santos',
    pages: 93
  }
];
