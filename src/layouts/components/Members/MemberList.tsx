import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Member } from '../../../models/Member';

interface MemberListProps {
  onSelectMember: (member: Member) => void;
}

export const MemberList = ({ onSelectMember }: MemberListProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
          audience: 'https://localhost:8443/api' //  must match your Spring audience
          },
        });

        const response = await fetch('https://localhost:8443/api/members/secure/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch members. Make sure you are authenticated and authorized.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [getAccessTokenSilently]);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2>Members List</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>{member.name}</td>
                <td>{member.contactInfo}</td>
                <td>
                  <button onClick={() => onSelectMember(member)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
