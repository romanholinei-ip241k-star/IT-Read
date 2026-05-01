import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';


const PageWrapper = styled.div`
  background: #0d1117;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 3rem 0;
`;

const AuthCard = styled.div`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 440px;
  margin: 0 auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

const CardTitle = styled.h2`
  color: #f0f6fc;
  font-weight: 700;
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
`;

const CardSubtitle = styled.p`
  color: #8b949e;
  font-size: 0.9rem;
  margin-bottom: 1.75rem;
`;

const StyledLabel = styled(Form.Label)`
  color: #c9d1d9;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const StyledInput = styled(Form.Control)`
  background: #0d1117;
  border: 1px solid #30363d;
  color: #f0f6fc;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;

  &:focus {
    background: #0d1117;
    border-color: #58a6ff;
    color: #f0f6fc;
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
  }

  &::placeholder {
    color: #484f58;
  }
`;

const SubmitBtn = styled(Button)`
  background: #238636;
  border-color: #238636;
  color: #fff;
  font-weight: 600;
  width: 100%;
  padding: 0.65rem;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:hover {
    background: #2ea043;
    border-color: #2ea043;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const FooterText = styled.p`
  color: #8b949e;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1.25rem;
  margin-bottom: 0;

  a {
    color: #58a6ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;


const Login = () => {
  const { login, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      clearAuthError();
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [clearAuthError]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      const success = await login(formData.email.trim(), formData.password);
      setSubmitting(false);
      if (success) navigate('/profile');
    },
    [login, formData, navigate]
  );

  return (
    <PageWrapper>
      <Container>
        <Row>
          <Col>
            <AuthCard>
              <CardTitle>Вхід до IT-Read</CardTitle>
              <CardSubtitle>Ласкаво просимо! Введіть свої дані для входу.</CardSubtitle>

              {authError && (
                <Alert variant="danger" style={{ fontSize: '0.85rem' }}>
                  {authError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <StyledLabel>Email-адреса</StyledLabel>
                  <StyledInput
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <StyledLabel>Пароль</StyledLabel>
                  <StyledInput
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <SubmitBtn type="submit" disabled={submitting}>
                  {submitting ? 'Вхід…' : 'Увійти'}
                </SubmitBtn>
              </Form>

              <FooterText>
                Немає облікового запису? <Link to="/register">Зареєструватись безкоштовно</Link>
              </FooterText>
            </AuthCard>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Login;
