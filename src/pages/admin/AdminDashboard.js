import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.3rem;
`;

const Subtitle = styled.p`
  color: #8b949e;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;

  &:hover {
    border-color: #58a6ff;
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

const StatNumber = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: #58a6ff;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.25rem;
`;


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ books: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDocs(collection(db, 'books')),
      getDocs(collection(db, 'users')),
    ]).then(([booksSnap, usersSnap]) => {
      setStats({ books: booksSnap.size, users: usersSnap.size });
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageTitle>Дашборд</PageTitle>
      <Subtitle>Огляд стану магазину IT-Read</Subtitle>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row className="g-4">
          <Col sm={6} md={4}>
            <StatCard onClick={() => navigate('/admin/books')}>
              <StatIcon>📚</StatIcon>
              <StatNumber>{stats.books}</StatNumber>
              <StatLabel>Книг у каталозі</StatLabel>
            </StatCard>
          </Col>

          <Col sm={6} md={4}>
            <StatCard onClick={() => navigate('/admin/users')}>
              <StatIcon>👥</StatIcon>
              <StatNumber>{stats.users}</StatNumber>
              <StatLabel>Зареєстрованих користувачів</StatLabel>
            </StatCard>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AdminDashboard;
