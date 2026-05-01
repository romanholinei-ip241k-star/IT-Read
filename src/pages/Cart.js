import React, { useCallback } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';


const PageWrapper = styled.div`
  background: #0d1117;
  min-height: 100vh;
  padding: 2.5rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 2rem;
`;

const OrderSummary = styled.div`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  padding: 1.5rem;
  position: sticky;
  top: 80px;
`;

const SummaryTitle = styled.h5`
  color: #f0f6fc;
  font-weight: 600;
  margin-bottom: 1.25rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #21262d;

  &:last-of-type {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  color: #8b949e;
  font-size: 0.9rem;
`;

const SummaryValue = styled.span`
  color: #c9d1d9;
  font-size: 0.9rem;
  font-weight: 500;
`;

const TotalRow = styled(SummaryRow)`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #30363d;
`;

const TotalLabel = styled.span`
  color: #f0f6fc;
  font-weight: 700;
  font-size: 1rem;
`;

const TotalValue = styled.span`
  color: #3fb950;
  font-weight: 700;
  font-size: 1.25rem;
`;

const CheckoutBtn = styled(Button)`
  background: #58a6ff;
  border-color: #58a6ff;
  color: #0d1117;
  font-weight: 600;
  width: 100%;
  padding: 0.65rem;
  border-radius: 8px;
  margin-top: 1.25rem;
  font-size: 1rem;

  &:hover {
    background: #79c0ff;
    border-color: #79c0ff;
    color: #0d1117;
  }
`;

const ClearBtn = styled(Button)`
  width: 100%;
  margin-top: 0.5rem;
  border-color: #30363d;
  color: #f85149;
  background: transparent;
  font-size: 0.85rem;

  &:hover {
    background: rgba(248, 81, 73, 0.08);
    border-color: #f85149;
    color: #f85149;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: #8b949e;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: block;
  }

  h3 {
    color: #f0f6fc;
    margin-bottom: 0.5rem;
  }
`;

const ContinueBtn = styled(Button)`
  margin-top: 1rem;
  background: #58a6ff;
  border-color: #58a6ff;
  color: #0d1117;
  font-weight: 600;

  &:hover {
    background: #79c0ff;
    border-color: #79c0ff;
    color: #0d1117;
  }
`;


const Cart = () => {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const itemCount = cartItems.length;
  const shipping = cartTotal >= 50 ? 0 : 4.99;
  const grandTotal = cartTotal + shipping;

  const handleCheckout = useCallback(() => {
    alert('🎉 Дякуюза за ваше замовлення! (Це демо — реальна оплата не проводиться.)');
    clearCart();
    navigate('/');
  }, [clearCart, navigate]);

  if (itemCount === 0) {
    return (
      <PageWrapper>
        <Container>
          <EmptyCart>
            <span className="icon">🛒</span>
            <h3>Ваш кошик порожній</h3>
            <p>Ви ще не додали жодної книги.</p>
            <ContinueBtn onClick={() => navigate('/catalog')}>
              Перейти до каталогу
            </ContinueBtn>
          </EmptyCart>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <PageTitle>Кошик ({cartCount} товар{cartCount !== 1 ? 'ів' : ''})</PageTitle>

        <Row className="g-5">
          <Col lg={8}>
            {cartTotal < 50 && (
              <Alert
                variant="info"
                style={{ background: 'rgba(88,166,255,0.08)', borderColor: '#58a6ff', color: '#c9d1d9' }}
                className="mb-3"
              >
                Додайте товарів ще на <strong>{formatPrice(50 - cartTotal)}</strong> для безкоштовної
                доставки!
              </Alert>
            )}
            {cartTotal >= 50 && (
              <Alert
                variant="success"
                style={{ background: 'rgba(63,185,80,0.08)', borderColor: '#3fb950', color: '#c9d1d9' }}
                className="mb-3"
              >
                🎉 Ви отримуєте <strong>безкоштовну доставку</strong>!
              </Alert>
            )}

            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </Col>

          <Col lg={4}>
            <OrderSummary>
              <SummaryTitle>Сума замовлення</SummaryTitle>

              <SummaryRow>
                <SummaryLabel>Проміжний підсумок ({cartCount} один.)</SummaryLabel>
                <SummaryValue>{formatPrice(cartTotal)}</SummaryValue>
              </SummaryRow>

              <SummaryRow>
                <SummaryLabel>Доставка</SummaryLabel>
                <SummaryValue>
                  {shipping === 0 ? (
                    <span style={{ color: '#3fb950' }}>Безкоштовно</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </SummaryValue>
              </SummaryRow>

              <TotalRow>
                <TotalLabel>Загалом</TotalLabel>
                <TotalValue>{formatPrice(grandTotal)}</TotalValue>
              </TotalRow>

              <CheckoutBtn onClick={handleCheckout}>
                Оформити замовлення
              </CheckoutBtn>

              <Button
                variant="link"
                className="w-100 mt-2 text-secondary"
                style={{ fontSize: '0.85rem' }}
                onClick={() => navigate('/catalog')}
              >
                ← Продовжити покупки
              </Button>

              <ClearBtn variant="outline-danger" onClick={clearCart}>
                Очистити кошик
              </ClearBtn>
            </OrderSummary>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Cart;
