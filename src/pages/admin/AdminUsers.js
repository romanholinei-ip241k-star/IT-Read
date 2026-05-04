import React, { useEffect, useState } from 'react';
import { Table, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.3rem;
`;

const Subtitle = styled.p`
  color: #8b949e;
  margin-bottom: 1.5rem;
`;

const StyledTable = styled(Table)`
  color: #c9d1d9;

  thead th {
    color: #8b949e;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-color: #30363d;
    background: #161b22;
  }

  tbody tr {
    border-color: #21262d;

    &:hover {
      background: rgba(88, 166, 255, 0.04);
    }
  }

  td {
    vertical-align: middle;
    border-color: #21262d;
    font-size: 0.88rem;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #58a6ff, #388bfd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0d1117;
  flex-shrink: 0;
`;


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
      .then((snap) => {
        setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      <PageTitle>Користувачі</PageTitle>
      <Subtitle>Зареєстровані облікові записи ({users.length})</Subtitle>

      <InputGroup style={{ maxWidth: 320, marginBottom: '1rem' }}>
        <Form.Control
          placeholder="Пошук за ім'ям або email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: '#f609de', borderColor: '#30363d', color: '#f0f6fc' }}
        />
      </InputGroup>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <StyledTable hover borderless>
            <thead>
              <tr>
                <th>#</th>
                <th>Користувач</th>
                <th>Email</th>
                <th>Дата реєстрації</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, idx) => (
                <tr key={user.id}>
                  <td style={{ color: '#484f58', fontSize: '0.8rem' }}>{idx + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Avatar>{getInitials(user.name)}</Avatar>
                      <span style={{ color: '#080227', fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#080227' }}>{user.email}</td>
                  <td style={{ color: '#080227' }}>{user.joinedAt || '—'}</td>
                  <td>
                    {user.isAdmin ? (
                      <Badge bg="warning" text="dark" style={{ fontSize: '0.72rem' }}>
                        Адмін
                      </Badge>
                    ) : (
                      <Badge bg="secondary" style={{ fontSize: '0.72rem' }}>
                        Користувач
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4" style={{ color: '#8b949e' }}>
                    Користувачів не знайдено
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
