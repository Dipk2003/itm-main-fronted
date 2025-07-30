import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { authSlice } from '@/features/auth/authSlice';

// Mock API responses for testing
export const mockApiResponses = {
  products: [
    {
      id: 1,
      name: 'Medical Equipment A',
      description: 'High-quality medical equipment',
      price: 1000,
      category: 'Medical Equipment',
      vendor: 'Test Vendor',
      rating: 4.5,
      imageUrl: '/test-image.jpg'
    },
    {
      id: 2,
      name: 'Laboratory Supplies B',
      description: 'Essential laboratory supplies',
      price: 500,
      category: 'Laboratory Supplies',
      vendor: 'Lab Vendor',
      rating: 4.2,
      imageUrl: '/test-image-2.jpg'
    }
  ],
  
  users: [
    {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'USER',
      isActive: true
    },
    {
      id: 2,
      name: 'Test Vendor',
      email: 'vendor@example.com',
      role: 'VENDOR',
      isActive: true
    }
  ],
  
  orders: [
    {
      id: 1,
      orderNumber: 'ORD-001',
      status: 'PENDING',
      totalAmount: 1500,
      createdAt: '2024-01-15',
      products: [1, 2]
    }
  ],
  
  notifications: [
    {
      id: 1,
      title: 'New Order',
      message: 'You have received a new order',
      type: 'ORDER',
      isRead: false,
      createdAt: '2024-01-15T10:00:00Z'
    }
  ]
};

// Mock Redux store for testing
export const createMockStore = (initialState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      // Add other reducers as needed
    },
    preloadedState: {
      auth: {
        user: initialState?.auth?.user || null,
        isAuthenticated: initialState?.auth?.isAuthenticated || false,
        token: initialState?.auth?.token || null,
        loading: initialState?.auth?.loading || false,
        error: initialState?.auth?.error || null,
      },
      ...initialState,
    },
  });
};

// Custom render function with Redux provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<RootState>;
}

export const renderWithRedux = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialState, ...renderOptions } = options || {};
  const store = createMockStore(initialState);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
};

// Mock API functions
export const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

// Test data generators
export const generateTestUser = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
  isActive: true,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const generateTestProduct = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  name: 'Test Product',
  description: 'Test product description',
  price: Math.floor(Math.random() * 1000) + 100,
  category: 'Medical Equipment',
  vendor: 'Test Vendor',
  rating: Math.random() * 5,
  imageUrl: '/test-image.jpg',
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const generateTestOrder = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000),
  orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
  status: 'PENDING',
  totalAmount: Math.floor(Math.random() * 5000) + 100,
  createdAt: new Date().toISOString(),
  products: [],
  ...overrides,
});

// Component testing utilities
export const fireEvent = {
  click: (element: HTMLElement) => {
    element.click();
  },
  change: (element: HTMLInputElement, value: string) => {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  },
  submit: (form: HTMLFormElement) => {
    form.dispatchEvent(new Event('submit', { bubbles: true }));
  },
};

// Wait utilities for async testing
export const waitFor = async (callback: () => void, timeout = 5000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      callback();
      return;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  throw new Error(`waitFor timeout after ${timeout}ms`);
};

// Mock browser APIs
export const mockBrowserAPIs = () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  
  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  });
  
  // Mock fetch
  global.fetch = jest.fn();
  
  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  })) as any;
  
  // Mock ResizeObserver
  global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  })) as any;
  
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Performance testing utilities
export const measureComponentRenderTime = async (component: () => ReactElement) => {
  const startTime = performance.now();
  render(component());
  const endTime = performance.now();
  return endTime - startTime;
};

// Accessibility testing helpers
export const checkA11y = (container: HTMLElement) => {
  const violations: string[] = [];
  
  // Check for alt attributes on images
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.getAttribute('alt')) {
      violations.push(`Image at index ${index} missing alt attribute`);
    }
  });
  
  // Check for labels on form inputs
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const hasLabel = input.getAttribute('aria-label') || 
                    input.getAttribute('aria-labelledby') ||
                    container.querySelector(`label[for="${input.id}"]`);
    
    if (!hasLabel) {
      violations.push(`Input at index ${index} missing label`);
    }
  });
  
  // Check for proper heading hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    if (currentLevel > previousLevel + 1) {
      violations.push(`Heading level jump at index ${index}: h${previousLevel} to h${currentLevel}`);
    }
    previousLevel = currentLevel;
  });
  
  return violations;
};

// Test environment setup
export const setupTestEnvironment = () => {
  mockBrowserAPIs();
  
  // Suppress console errors during tests
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (args[0]?.includes?.('Warning: ReactDOM.render is no longer supported')) {
      return;
    }
    originalError(...args);
  };
  
  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });
};

// Export commonly used test utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
