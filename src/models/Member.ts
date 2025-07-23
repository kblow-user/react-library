export interface Member {
  id: number;
  name: string;
  email: string;
  membershipDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  address?: string;
  contactInfo?: string;
  membershipExpiryDate?: string;
}