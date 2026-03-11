declare global {
  function mockSupabaseResponse(data: any, error?: any): any;
  function mockAuthUser(userId: string): any;
  function mockAuthError(): any;
}

export {};