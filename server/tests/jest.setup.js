// tests/setup/jest.setup.js
beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset localStorage mock
    localStorage.store = {};
    localStorage.setItem.mockImplementation((key, value) => {
      localStorage.store[key] = value;
    });
    localStorage.getItem.mockImplementation(key => localStorage.store[key]);
    localStorage.removeItem.mockImplementation(key => {
      delete localStorage.store[key];
    });
    localStorage.clear.mockImplementation(() => {
      localStorage.store = {};
    });
  
    // Reset fetch mock
    fetch.mockClear();
  });
  
  afterEach(() => {
    // Clean up after each test
    localStorage.store = {};
  });
  
  // Add global error handler for unhandled promises
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
  });