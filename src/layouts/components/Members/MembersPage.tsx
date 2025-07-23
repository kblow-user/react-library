import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Member } from '../../../models/Member';

export const MembersPage = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('https://localhost:8443/api/members/secure/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch member data.');
        }

        const data: Member[] = await response.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [getAccessTokenSilently, isAuthenticated]);

  if (loading) {
    return <div className="container mt-5"><p>Loading member info...</p></div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger"><p>Error: {error}</p></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Welcome, {user?.name}!</h2>
      <div className="card shadow-sm p-4">
        <h4 className="mb-3">All Members</h4>

        {members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Member Since</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{new Date(member.membershipDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${member.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
