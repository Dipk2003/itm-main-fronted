// Mock mode for development when backend is not available or API endpoints are missing
export const MOCK_MODE = false; // Disabled to use real backend

// Check if backend is partially available (some endpoints missing)
export const isBackendPartiallyAvailable = () => {
  return typeof window !== 'undefined' && window.location.hostname === 'localhost';
};

// Mock responses for development
export const mockResponses = {
  products: {
    add: {
      id: Math.floor(Math.random() * 1000),
      name: 'Mock Product',
      description: 'This is a mock product created in development mode',
      price: 99.99,
      stock: 10,
      categoryId: 1,
      vendorId: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    uploadImages: ['mock-image-1.jpg', 'mock-image-2.jpg']
  },
  categories: [
    { id: 1, name: 'Electronics', description: 'Electronic devices and accessories' },
    { id: 2, name: 'Computer Accessories', description: 'Computer hardware and accessories' },
    { id: 3, name: 'Mobile Accessories', description: 'Mobile phone accessories' },
    { id: 4, name: 'Office Supplies', description: 'Office and business supplies' },
    { id: 5, name: 'Hardware & Tools', description: 'Hardware and tools' },
    { id: 6, name: 'Networking Equipment', description: 'Networking devices and equipment' },
    { id: 7, name: 'Audio & Video', description: 'Audio and video equipment' },
    { id: 8, name: 'Storage Devices', description: 'Data storage devices' }
  ]
};

// Mock API delay to simulate network requests
export const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));
