import React, { useCallback } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { formatPrice, truncateText, categoryColor } from '../utils/helpers';


const StyledCard = styled(Card)`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    border-color: #58a6ff;
  }
`;

const CoverWrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 220px;
  background: #0d1117;
`;

const CoverImage = styled(Card.Img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;

  ${StyledCard}:hover & {
    transform: scale(1.04);
  }
`;

const CategoryBadge = styled(Badge)`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const CardBody = styled(Card.Body)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const Title = styled(Card.Title)`
  color: #f0f6fc;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.25rem;
`;

const Author = styled.p`
  color: #8b949e;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #8b949e;
  font-size: 0.78rem;
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 0.75rem;
`;

const Rating = styled.div`
  color: #f0a030;
  font-size: 0.78rem;
  margin-bottom: 0.6rem;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #3fb950;
`;

const AddButton = styled(Button)`
  font-size: 0.78rem;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
`;


const BookCard = ({ book }) => {
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const isInCart = cartItems.some((item) => item.id === book.id);

  const handleCardClick = useCallback(() => {
    navigate(`/book/${book.id}`);
  }, [navigate, book.id]);

  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();
      addToCart(book);
    },
    [addToCart, book]
  );

  return (
    <StyledCard onClick={handleCardClick}>
      <CoverWrapper>
        <CoverImage variant="top" src={book.coverImage} alt={book.title} />
        <CategoryBadge bg={categoryColor(book.category)}>{book.category}</CategoryBadge>
      </CoverWrapper>

      <CardBody>
        <Title>{book.title}</Title>
        <Author>{book.author}</Author>
        <Rating>
          {'★'.repeat(Math.floor(book.rating))}
          {'☆'.repeat(5 - Math.floor(book.rating))}
          &nbsp;
          <span style={{ color: '#8b949e' }}>({book.rating})</span>
        </Rating>
        <Description>{truncateText(book.description, 90)}</Description>

        <PriceRow>
          <Price>{formatPrice(book.price)}</Price>
          <AddButton
            variant={isInCart ? 'success' : 'outline-primary'}
            size="sm"
            onClick={handleAddToCart}
          >
            {isInCart ? '✓ Додано' : '+ Кошик'}
          </AddButton>
        </PriceRow>
      </CardBody>
    </StyledCard>
  );
};

export default BookCard;
