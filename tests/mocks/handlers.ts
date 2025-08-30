import { rest } from 'msw';

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User'
        }
      })
    );
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        message: 'User registered successfully'
      })
    );
  }),

  // Product endpoints
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        products: [
          {
            id: '1',
            name: 'Test Product 1',
            description: 'Description 1',
            price: 100,
            category: 'Category 1'
          },
          {
            id: '2',
            name: 'Test Product 2',
            description: 'Description 2',
            price: 200,
            category: 'Category 2'
          }
        ],
        total: 2,
        page: 1,
        perPage: 10
      })
    );
  }),

  rest.get('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: `Test Product ${id}`,
        description: `Description ${id}`,
        price: 100,
        category: 'Test Category'
      })
    );
  }),

  // Category endpoints
  rest.get('/api/categories', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        categories: [
          {
            id: '1',
            name: 'Category 1',
            description: 'Description 1'
          },
          {
            id: '2',
            name: 'Category 2',
            description: 'Description 2'
          }
        ]
      })
    );
  }),

  // Order endpoints
  rest.get('/api/orders', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        orders: [
          {
            id: '1',
            total: 100,
            status: 'PENDING',
            createdAt: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            total: 200,
            status: 'COMPLETED',
            createdAt: '2024-01-02T00:00:00Z'
          }
        ],
        total: 2,
        page: 1,
        perPage: 10
      })
    );
  }),

  rest.post('/api/orders', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '3',
        total: 300,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      })
    );
  }),

  // Cart endpoints
  rest.get('/api/cart', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [
          {
            productId: '1',
            quantity: 2,
            price: 100
          },
          {
            productId: '2',
            quantity: 1,
            price: 200
          }
        ],
        total: 400
      })
    );
  }),

  rest.post('/api/cart/add', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Item added to cart'
      })
    );
  }),

  // User profile endpoints
  rest.get('/api/user/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        addresses: [
          {
            id: '1',
            type: 'SHIPPING',
            address: 'Test Address 1'
          }
        ]
      })
    );
  }),

  rest.put('/api/user/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Profile updated successfully'
      })
    );
  }),

  // Vendor endpoints
  rest.get('/api/vendors', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        vendors: [
          {
            id: '1',
            name: 'Vendor 1',
            rating: 4.5,
            productCount: 100
          },
          {
            id: '2',
            name: 'Vendor 2',
            rating: 4.0,
            productCount: 50
          }
        ],
        total: 2,
        page: 1,
        perPage: 10
      })
    );
  }),

  rest.get('/api/vendors/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: `Vendor ${id}`,
        description: `Description for Vendor ${id}`,
        rating: 4.5,
        productCount: 100,
        address: 'Test Address',
        contact: {
          email: 'vendor@example.com',
          phone: '1234567890'
        }
      })
    );
  }),

  // Search endpoints
  rest.get('/api/search', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        products: [
          {
            id: '1',
            name: 'Search Result 1',
            price: 100
          },
          {
            id: '2',
            name: 'Search Result 2',
            price: 200
          }
        ],
        total: 2,
        page: 1,
        perPage: 10
      })
    );
  }),

  // Analytics endpoints
  rest.get('/api/analytics/dashboard', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        totalOrders: 1000,
        totalRevenue: 50000,
        averageOrderValue: 500,
        topProducts: [
          {
            id: '1',
            name: 'Top Product 1',
            sales: 100
          },
          {
            id: '2',
            name: 'Top Product 2',
            sales: 80
          }
        ],
        recentOrders: [
          {
            id: '1',
            total: 100,
            status: 'COMPLETED'
          },
          {
            id: '2',
            total: 200,
            status: 'PENDING'
          }
        ]
      })
    );
  })
];
