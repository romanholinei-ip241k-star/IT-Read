import React from 'react';
import { Navbar as BSNavbar, Container, Nav, Badge, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';



const StyledNavbar = styled(BSNavbar)`
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  border-bottom: 1px solid #30363d;
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
`;

const Brand = styled(BSNavbar.Brand)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #58a6ff !important;
  letter-spacing: -0.5px;

  span {
    color: #f0f6fc;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: #c9d1d9 !important;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;

  &:hover,
  &.active {
    color: #58a6ff !important;
    background: rgba(88, 166, 255, 0.08);
  }
`;

const FirstNavLink = styled(StyledNavLink)`
  margin-left: 3rem;
`;

const AdminNavLink = styled(StyledNavLink)`
  margin-left: 0.2rem;
`;

const CartBadge = styled(Badge)`
  font-size: 0.65rem;
  vertical-align: super;
  margin-left: 2px;
`;

const UserName = styled.span`
  color: #58a6ff;
  font-weight: 600;
  margin-right: 0.75rem;
  font-size: 0.9rem;
`;


const AppNavbar = () => {
  const { cartCount } = useCart();
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <StyledNavbar expand="lg" variant="dark">
      <Container>
        <Brand as={NavLink} to="/">
          IT-<span>Read</span>
        </Brand>

        <BSNavbar.Toggle aria-controls="main-nav" />

        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto align-items-center">
            <FirstNavLink to="/">Головна</FirstNavLink>
            <StyledNavLink to="/catalog">Каталог</StyledNavLink>
            {isAdmin && (
              <AdminNavLink to="/admin">Адмінка</AdminNavLink>
            )}
          </Nav>

          <Nav className="align-items-center">
            <StyledNavLink to="/cart">
              🛒 Кошик
              {cartCount > 0 && (
                <CartBadge bg="danger" pill>
                  {cartCount}
                </CartBadge>
              )}
            </StyledNavLink>

            {isAuthenticated ? (
              <>
                <StyledNavLink to="/profile">
                  <UserName>👤 {currentUser.name}</UserName>
                </StyledNavLink>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleLogout}
                  style={{ borderColor: '#30363d', color: '#c9d1d9' }}
                >
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <StyledNavLink to="/login">Увійти</StyledNavLink>
                <StyledNavLink to="/register">Реєстрація</StyledNavLink>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default AppNavbar;
