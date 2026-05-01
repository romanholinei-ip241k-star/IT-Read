import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';


const FooterWrapper = styled.footer`
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  border-top: 1px solid #30363d;
  color: #8b949e;
  padding: 2.5rem 0 1.5rem;
  margin-top: auto;
`;

const FooterBrand = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #58a6ff;
  margin-bottom: 0.5rem;

  span {
    color: #f0f6fc;
  }
`;

const FooterTagline = styled.p`
  font-size: 0.85rem;
  color: #8b949e;
  margin: 0;
`;

const FooterHeading = styled.h6`
  color: #f0f6fc;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled(NavLink)`
  display: block;
  color: #8b949e;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.4rem;
  transition: color 0.2s;

  &:hover {
    color: #58a6ff;
  }
`;

const Divider = styled.hr`
  border-color: #30363d;
  margin: 1.5rem 0 1rem;
`;

const Copyright = styled.p`
  font-size: 0.8rem;
  color: #484f58;
  margin: 0;
  text-align: center;
`;


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <FooterWrapper>
      <Container>
        <Row className="mb-3">
          <Col md={4} className="mb-4 mb-md-0">
            <FooterBrand>
              IT-<span>Read</span>
            </FooterBrand>
            <FooterTagline>
              Ваш книжковий магазин з програмної інженерії, архітектури та сучасних
              практик розробки.
            </FooterTagline>
          </Col>

          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <FooterHeading>Магазин</FooterHeading>
            <FooterLink to="/catalog">Всі книги</FooterLink>
            <FooterLink to="/catalog?category=JavaScript">JavaScript</FooterLink>
            <FooterLink to="/catalog?category=React">React</FooterLink>
            <FooterLink to="/catalog?category=Python">Python</FooterLink>
          </Col>

          <Col md={2} sm={6} className="mb-4 mb-md-0">
            <FooterHeading>Обліковий запис</FooterHeading>
            <FooterLink to="/login">Увійти</FooterLink>
            <FooterLink to="/register">Реєстрація</FooterLink>
            <FooterLink to="/profile">Мій профіль</FooterLink>
            <FooterLink to="/cart">Кошик</FooterLink>
          </Col>

          <Col md={4} sm={12}>
            <FooterHeading>Про нас</FooterHeading>
            <FooterTagline>
              IT-Read — це відібраний книжковий магазин для розробників, архітекторів та
              ІТ-фахівців. Лише найкращі технічні книги для прокачування ваших навичок.
            </FooterTagline>
          </Col>
        </Row>

        <Divider />

        <Copyright>
          © {year} IT-Read. Всі права захищено. Розроблено на React &amp; ❤️ для
          розробників.
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
