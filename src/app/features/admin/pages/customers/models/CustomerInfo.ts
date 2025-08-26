export interface CustomerInfo {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  emailConfirmed: boolean;
  lockoutEnabled: boolean;
  lockoutEnd?: string | null; 
  isActive: boolean;
  roles: string[];
}