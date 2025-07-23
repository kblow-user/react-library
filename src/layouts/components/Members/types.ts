// src/components/Members/types.ts
export interface Member {
  id: number;
  name: string;
  address?: string;
  contactInfo: string;
  registrationDate: string;
  membershipExpiryDate: string;
}