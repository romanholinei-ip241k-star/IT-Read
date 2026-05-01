import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Container, Nav, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0d1117;
`;

const Sidebar = styled.aside`
  width: 220px;
  background: #161b22;
  border-right: 1px solid #30363d;
  padding: 1.5rem 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #30363d;
  }
`;

const SidebarBrand = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #58a6ff;
  margin-bottom: 2rem;
  padding-left: 0.5rem;

  span {
    color: #f0f6fc;
  }
`;

const SideLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #8b949e;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  transition: background 0.15s, color 0.15s;

  &:hover,
  &.active {
    color: #f0f6fc;
    background: rgba(88, 166, 255, 0.1);
  }

  &.active {
    color: #58a6ff;
    border-left: 3px solid #58a6ff;
    padding-left: calc(0.75rem - 3px);
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <LayoutWrapper>
      <Sidebar>
        <SidebarBrand>
          IT-<span>Read</span> &nbsp;|&nbsp; Адмін
        </SidebarBrand>

        <Nav className="flex-column">
          <SideLink to="/admin" end>
            📊 Дашборд
          </SideLink>
          <SideLink to="/admin/books">
            📚 Книги
          </SideLink>
          <SideLink to="/admin/users">
            👥 Користувачі
          </SideLink>
        </Nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
          <Button
            variant="outline-secondary"
            size="sm"
            style={{ borderColor: '#30363d', color: '#8b949e', width: '100%' }}
            onClick={() => navigate('/')}
          >
            ← На сайт
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={handleLogout}
          >
            Вийти
          </Button>
        </div>
      </Sidebar>

      <Content>
        <Outlet />
      </Content>
    </LayoutWrapper>
  );
};

export default AdminLayout;
