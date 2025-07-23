import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Member } from '../models/Member';

const ViewMembers: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const NAMESPACE = 'https://react-library.com/roles'; // Ensure this matches your Auth0 Action namespace

  useEffect(() => {
    if (user && user[NAMESPACE]?.includes('ADMIN')) {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('https://localhost:8443/api/members/secure/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await response.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchMembers();
    }
  }, [isAuthenticated, isAdmin, getAccessTokenSilently]);

  if (isLoading) return <p>Loading authentication...</p>;
  if (!isAuthenticated) return <p>You must be logged in to view this page.</p>;
  if (!isAdmin) return <p>Access denied: Admins only.</p>;

  return (
    <div className="container mt-5">
      <h2>Library Members</h2>
      {loading && <p>Loading members...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && !error && members.length === 0 && <p>No members found.</p>}

      {!loading && !error && members.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Address</th>
                <th>Registered</th>
                <th>Membership Expiry</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.contactInfo}</td>
                  <td>{member.address || '—'}</td>
                  <td>{new Date(member.membershipDate).toLocaleDateString()}</td>
                  <td>{member.membershipExpiryDate ? new Date(member.membershipExpiryDate).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewMembers;
