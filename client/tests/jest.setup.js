beforeEach(() => {
    jest.clearAllMocks();
    
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
  
    fetch.mockClear();
  });
  
  afterEach(() => {
    localStorage.store = {};
  });
  
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Promise Rejection:', error);
  });