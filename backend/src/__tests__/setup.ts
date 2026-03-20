// Mock Supabase client
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(),
    storage: {
      from: jest.fn(),
    },
    auth: {
      getUser: jest.fn(),
    },
  },
}));

// Mock environment variables
process.env.ADMIN_SECRET = 'test-admin-secret';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';

// Global test utilities
global.mockSupabaseResponse = (data: any, error?: any) => {
  return {
    data,
    error,
    single: jest.fn().mockResolvedValue({ data, error }),
  };
};

global.mockAuthUser = (userId: string) => {
  return {
    data: { user: { id: userId } },
    error: null,
  };
};

global.mockAuthError = () => {
  return {
    data: { user: null },
    error: { message: 'Invalid token' },
  };
};
