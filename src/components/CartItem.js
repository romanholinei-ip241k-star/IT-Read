import React, { useCallback } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';


const ItemWrapper = styled.div`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.2s;

  &:hover {
    border-color: #58a6ff;
  }
`;

const Cover = styled.img`
  width: 70px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const BookTitle = styled.h6`
  color: #f0f6fc;
  font-weight: 600;
  margin-bottom: 0.2rem;
  cursor: pointer;

  &:hover {
    color: #58a6ff;
  }
`;

const BookAuthor = styled.p`
  color: #8b949e;
  font-size: 0.82rem;
  margin-bottom: 0.4rem;
`;

const UnitPrice = styled.p`
  color: #8b949e;
  font-size: 0.82rem;
  margin: 0;
`;

const SubTotal = styled.span`
  color: #3fb950;
  font-weight: 700;
  font-size: 1rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QtyButton = styled(Button)`
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
  border-radius: 6px;
  border-color: #30363d;
  color: #c9d1d9;
  background: transparent;

  &:hover {
    background: #30363d;
    border-color: #58a6ff;
  }
`;

const QtyDisplay = styled.span`
  color: #f0f6fc;
  font-weight: 600;
  min-width: 1.5rem;
  text-align: center;
`;

const RemoveButton = styled(Button)`
  font-size: 0.78rem;
  padding: 0.25rem 0.6rem;
  border-color: #30363d;
  color: #f85149;
  background: transparent;

  &:hover {
    background: rgba(248, 81, 73, 0.1);
    border-color: #f85149;
    color: #f85149;
  }
`;


const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleIncrease = useCallback(() => {
    updateQuantity(item.id, item.quantity + 1);
  }, [updateQuantity, item.id, item.quantity]);

  const handleDecrease = useCallback(() => {
    updateQuantity(item.id, item.quantity - 1);
  }, [updateQuantity, item.id, item.quantity]);

  const handleRemove = useCallback(() => {
    removeFromCart(item.id);
  }, [removeFromCart, item.id]);

  const goToDetail = useCallback(() => {
    navigate(`/book/${item.id}`);
  }, [navigate, item.id]);

  return (
    <ItemWrapper>
      <Row className="align-items-center g-3">
        <Col xs="auto">
          <Cover src={item.coverImage} alt={item.title} onClick={goToDetail} />
        </Col>

        <Col>
          <BookTitle onClick={goToDetail}>{item.title}</BookTitle>
          <BookAuthor>{item.author}</BookAuthor>
          <UnitPrice>{formatPrice(item.price)} за шт.</UnitPrice>
        </Col>

        <Col xs="auto">
          <QuantityControl>
            <QtyButton variant="outline-secondary" onClick={handleDecrease}>
              −
            </QtyButton>
            <QtyDisplay>{item.quantity}</QtyDisplay>
            <QtyButton variant="outline-secondary" onClick={handleIncrease}>
              +
            </QtyButton>
          </QuantityControl>
        </Col>

        <Col xs="auto" className="text-end">
          <SubTotal>{formatPrice(item.price * item.quantity)}</SubTotal>
          <div className="mt-2">
            <RemoveButton variant="outline-danger" size="sm" onClick={handleRemove}>
              Видалити
            </RemoveButton>
          </div>
        </Col>
      </Row>
    </ItemWrapper>
  );
};

export default CartItem;
