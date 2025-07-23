import { Member } from '../../../models/Member';

interface MemberDetailsProps {
  member: Member | null;
  onBack: () => void;
}

export const MemberDetails = ({ member, onBack }: MemberDetailsProps) => {
  if (!member) return null;

  return (
   <div className="card p-4 shadow-sm mt-4">
      <h2 className="mb-3">Member Details</h2>
      <p><strong>ID:</strong> {member.id}</p>
      <p><strong>Name:</strong> {member.name}</p>
      <p><strong>Address:</strong> {member.address || 'N/A'}</p>
      <p><strong>Contact Info:</strong> {member.contactInfo || 'N/A'}</p>
      <p><strong>Registration Date:</strong> {member.membershipDate}</p>
      <p><strong>Membership Expiry Date:</strong> {member.membershipExpiryDate || 'N/A'}</p>
      <button onClick={onBack} className="btn btn-secondary mt-3">Back to List</button>
    </div>
  );
};
