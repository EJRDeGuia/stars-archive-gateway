
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  THESES: '/api/theses',
  COLLEGES: '/api/colleges',
  USERS: '/api/users',
  SEARCH: '/api/search',
  UPLOAD: '/api/upload'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ARCHIVIST: '/archivist',
  EXPLORE: '/explore',
  UPLOAD: '/upload',
  PROFILE: '/profile',
  COLLECTIONS: '/collections',
  LIBRARY: '/library',
  SETTINGS: '/settings'
};

export const COLORS = {
  PRIMARY: 'dlsl-green',
  SECONDARY: 'gray',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  INFO: 'blue'
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};
