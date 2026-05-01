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

  &.is-invalid {
    border-color: #f85149;
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

const FieldError = styled(Form.Text)`
  color: #f85149 !important;
  font-size: 0.78rem;
`;


const validate = ({ name, email, password, confirm }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Ім'я та прізвище обов'язкові.";
  if (!email.trim()) {
    errors.email = "Email обов'язковий.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Введіть коректний email.';
  }
  if (!password) {
    errors.password = "Пароль обов'язковий.";
  } else if (password.length < 6) {
    errors.password = 'Пароль має містити не менше 6 символів.';
  }
  if (confirm !== password) errors.confirm = 'Паролі не збігаються.';
  return errors;
};


const Register = () => {
  const { register, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      clearAuthError();
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    [clearAuthError]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const errors = validate(formData);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setSubmitting(true);
      const success = await register(formData.name.trim(), formData.email.trim(), formData.password);
      setSubmitting(false);
      if (success) navigate('/profile');
    },
    [register, formData, navigate]
  );

  return (
    <PageWrapper>
      <Container>
        <Row>
          <Col>
            <AuthCard>
              <CardTitle>Створення облікового запису</CardTitle>
              <CardSubtitle>
                Приєднуйтесь до IT-Read і почніть формувати свою бібліотеку.
              </CardSubtitle>

              {authError && (
                <Alert variant="danger" style={{ fontSize: '0.85rem' }}>
                  {authError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <StyledLabel>Ім'я та прізвище</StyledLabel>
                  <StyledInput
                    type="text"
                    name="name"
                    placeholder="Іванко Петренко"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.name}
                    required
                    autoComplete="name"
                  />
                  {fieldErrors.name && (
                    <FieldError>{fieldErrors.name}</FieldError>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <StyledLabel>Email-адреса</StyledLabel>
                  <StyledInput
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.email}
                    required
                    autoComplete="email"
                  />
                  {fieldErrors.email && (
                    <FieldError>{fieldErrors.email}</FieldError>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <StyledLabel>Пароль</StyledLabel>
                  <StyledInput
                    type="password"
                    name="password"
                    placeholder="Мін. 6 символів"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.password}
                    required
                    autoComplete="new-password"
                  />
                  {fieldErrors.password && (
                    <FieldError>{fieldErrors.password}</FieldError>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <StyledLabel>Підтвердження паролю</StyledLabel>
                  <StyledInput
                    type="password"
                    name="confirm"
                    placeholder="Повторіть пароль"
                    value={formData.confirm}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.confirm}
                    required
                    autoComplete="new-password"
                  />
                  {fieldErrors.confirm && (
                    <FieldError>{fieldErrors.confirm}</FieldError>
                  )}
                </Form.Group>

                <SubmitBtn type="submit" disabled={submitting}>
                  {submitting ? 'Створення…' : 'Створити обліковий запис'}
                </SubmitBtn>
              </Form>

              <FooterText>
                Вже маєте обліковий запис? <Link to="/login">Увійти</Link>
              </FooterText>
            </AuthCard>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Register;
