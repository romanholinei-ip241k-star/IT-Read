import React from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';


const PageWrapper = styled.div`
  background: #0d1117;
  min-height: 100vh;
  padding: 2.5rem 0;
`;

const AvatarCircle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #58a6ff 0%, #388bfd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #0d1117;
  margin: 0 auto 1rem;
  user-select: none;
`;

const ProfileCard = styled.div`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
`;

const UserName = styled.h2`
  color: #f0f6fc;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 0.3rem;
`;

const UserEmail = styled.p`
  color: #8b949e;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const JoinDate = styled.p`
  color: #484f58;
  font-size: 0.8rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: #58a6ff;
`;

const StatLabel = styled.div`
  font-size: 0.72rem;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.2rem;
`;

const SectionTitle = styled.h4`
  color: #f0f6fc;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #30363d;
`;

const CartSummaryCard = styled.div`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

const CartBookItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #21262d;
  font-size: 0.85rem;
  color: #c9d1d9;

  &:last-child {
    border-bottom: none;
  }
`;

const EmptyNotice = styled.p`
  color: #8b949e;
  font-size: 0.9rem;
  font-style: italic;
`;

const LogoutBtn = styled(Button)`
  border-color: #f85149;
  color: #f85149;
  background: transparent;
  font-size: 0.85rem;
  margin-top: 1rem;
  width: 100%;

  &:hover {
    background: rgba(248, 81, 73, 0.08);
    border-color: #f85149;
    color: #f85149;
  }
`;

const NotAuthWrapper = styled.div`
  text-align: center;
  padding: 5rem 0;
  color: #8b949e;

  h3 {
    color: #f0f6fc;
    margin-bottom: 0.5rem;
  }
`;

const PrimaryBtn = styled(Button)`
  background: #58a6ff;
  border-color: #58a6ff;
  color: #0d1117;
  font-weight: 600;
  margin: 0.4rem;

  &:hover {
    background: #79c0ff;
    border-color: #79c0ff;
    color: #0d1117;
  }
`;


const Profile = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { cartItems, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <PageWrapper>
        <Container>
          <NotAuthWrapper>
            <h3>Ви не авторизовані</h3>
            <p>Будь ласка, увійдіть, щоб переглянути профіль.</p>
            <div>
              <PrimaryBtn onClick={() => navigate('/login')}>Увійти</PrimaryBtn>
              <Button
                variant="outline-secondary"
                style={{ borderColor: '#30363d', color: '#c9d1d9', margin: '0.4rem' }}
                onClick={() => navigate('/register')}
              >
                Реєстрація
              </Button>
            </div>
          </NotAuthWrapper>
        </Container>
      </PageWrapper>
    );
  }

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <PageWrapper>
      <Container>
        <Row className="g-5">
          <Col lg={4} md={5}>
            <ProfileCard>
              <AvatarCircle>{initials}</AvatarCircle>
              <UserName>{currentUser.name}</UserName>
              <UserEmail>{currentUser.email}</UserEmail>
              <Badge bg="primary" style={{ fontSize: '0.72rem' }}>
                IT-Read Член
              </Badge>
              <JoinDate className="mt-2">Член з {currentUser.joinedAt}</JoinDate>

              <StatsGrid>
                <StatCard>
                  <StatNumber>{cartCount}</StatNumber>
                  <StatLabel>Товарів у кошику</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{formatPrice(cartTotal)}</StatNumber>
                  <StatLabel>Сума кошика</StatLabel>
                </StatCard>
              </StatsGrid>

              <LogoutBtn variant="outline-danger" onClick={handleLogout}>
                Вийти
              </LogoutBtn>
            </ProfileCard>
          </Col>

          <Col lg={8} md={7}>
            <SectionTitle>Поточний кошик</SectionTitle>

            {cartItems.length === 0 ? (
              <EmptyNotice>Кошик порожній. Перегляньте каталог!</EmptyNotice>
            ) : (
              <CartSummaryCard>
                {cartItems.map((item) => (
                  <CartBookItem key={item.id}>
                    <span>
                      {item.title}{' '}
                      <span style={{ color: '#8b949e' }}>×{item.quantity}</span>
                    </span>
                    <span style={{ color: '#3fb950', fontWeight: 600 }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </CartBookItem>
                ))}

                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                    Разом: <strong style={{ color: '#3fb950' }}>{formatPrice(cartTotal)}</strong>
                  </span>
                  <PrimaryBtn size="sm" onClick={() => navigate('/cart')}>
                    До кошика →
                  </PrimaryBtn>
                </div>
              </CartSummaryCard>
            )}

            <div className="mt-3">
              <PrimaryBtn onClick={() => navigate('/catalog')}>
                Перейти до каталогу
              </PrimaryBtn>
            </div>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Profile;
