declare module '@shared/schema' {
  export interface Role {
    id: number;
    name: string;
    description?: string;
    // agrega más propiedades según tu schema
  }
  
  export interface User {
    id: number;
    username: string;
    // agrega más propiedades según tu schema
  }
}

declare module '@shared/routes' {
  // exporta los tipos que necesites de routes
  export interface UserResponse {
    user: import('@shared/schema').User;
  }
}
