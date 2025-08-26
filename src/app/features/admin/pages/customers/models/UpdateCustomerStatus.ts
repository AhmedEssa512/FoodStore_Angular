export interface UpdateUserStatus {
  isActive: boolean;
  suspensionEnd?: string | null; // optional ISO date string
}