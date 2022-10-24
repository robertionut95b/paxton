export interface Permission {
  name: string;
}

export interface User {
  permissions: Permission[];
  username: string;
}
