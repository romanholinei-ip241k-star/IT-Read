import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { getBookById, getBooks } from '../services/bookService';
import BookCard from '../components/BookCard';
import { formatPrice, categoryColor, getRandomItems } from '../utils/helpers';


const PageWrapper = styled.div`
  background: #0d1117;
  min-height: 100vh;
  padding: 2.5rem 0;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #58a6ff;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    text-decoration: underline;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  max-width: 260px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: block;
  margin: 0 auto;
`;

const BookTitle = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.5rem;
`;

const BookAuthor = styled.p`
  color: #8b949e;
  font-size: 1.05rem;
  margin-bottom: 0.75rem;
`;

const Rating = styled.div`
  color: #f0a030;
  font-size: 1rem;
  margin-bottom: 1rem;

  span {
    color: #8b949e;
    font-size: 0.85rem;
    margin-left: 0.3rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.span`
  font-size: 0.7rem;
  color: #484f58;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const MetaValue = styled.span`
  font-size: 0.9rem;
  color: #c9d1d9;
  font-weight: 500;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3fb950;
  margin-bottom: 1.25rem;
`;

const AddToCartBtn = styled(Button)`
  background: #58a6ff;
  border-color: #58a6ff;
  color: #0d1117;
  font-weight: 600;
  padding: 0.65rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  margin-right: 0.75rem;

  &:hover {
    background: #79c0ff;
    border-color: #79c0ff;
    color: #0d1117;
  }

  &:disabled {
    background: #3fb950;
    border-color: #3fb950;
    color: #0d1117;
  }
`;

const DescriptionSection = styled.section`
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #30363d;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #f0f6fc;
  margin-bottom: 0.75rem;
`;

const DescriptionText = styled.p`
  color: #8b949e;
  line-height: 1.8;
  font-size: 0.95rem;
`;

const RelatedSection = styled.section`
  margin-top: 3rem;
  padding-top: 2.5rem;
  border-top: 1px solid #30363d;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 5rem 0;
  color: #8b949e;

  h2 {
    color: #f0f6fc;
    margin-bottom: 1rem;
  }
`;


const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const isInCart = cartItems.some((item) => item.id === book?.id);

  useEffect(() => {
    setLoading(true);
    Promise.all([getBookById(id), getBooks()]).then(([found, all]) => {
      setBook(found);
      if (found) {
        const others = all.filter(
          (b) => b.id !== found.id && b.category === found.category
        );
        setRelatedBooks(getRandomItems(others, 3));
      }
      setLoading(false);
    });
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (book) addToCart(book);
  }, [addToCart, book]);

  if (loading) {
    return (
      <PageWrapper>
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </PageWrapper>
    );
  }

  if (!book) {
    return (
      <PageWrapper>
        <Container>
          <NotFound>
            <h2>Книгу не знайдено</h2>
            <p>Книги, яку ви шукаєте, немає у нашому каталозі.</p>
            <Button variant="primary" onClick={() => navigate('/catalog')}>
              Повернутись до каталогу
            </Button>
          </NotFound>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <BackLink onClick={() => navigate(-1)}>← Назад</BackLink>

        <Row className="g-5 g-md-6">
          <Col md={3} className="text-center">
            <CoverImage src={book.coverImage} alt={book.title} />
          </Col>

          <Col md={9}>
            <Badge bg={categoryColor(book.category)} className="mb-2">
              {book.category}
            </Badge>

            <BookTitle>{book.title}</BookTitle>
            <BookAuthor>Автор: {book.author}</BookAuthor>

            <Rating>
              {'★'.repeat(Math.floor(book.rating))}
              {'☆'.repeat(5 - Math.floor(book.rating))}
              <span>({book.rating} / 5)</span>
            </Rating>

            <MetaRow>
              {[
                { label: 'Видавець', value: book.publisher },
                { label: 'Рік', value: book.year },
                { label: 'Сторінок', value: book.pages },
              ].map(({ label, value }) => (
                <MetaItem key={label}>
                  <MetaLabel>{label}</MetaLabel>
                  <MetaValue>{value}</MetaValue>
                </MetaItem>
              ))}
            </MetaRow>

            <Price>{formatPrice(book.price)}</Price>

            <div>
              <AddToCartBtn
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                {isInCart ? '✓ У кошику' : '🛒 Додати до кошика'}
              </AddToCartBtn>

              {isInCart && (
                <Button
                  variant="outline-secondary"
                  style={{ borderColor: '#30363d', color: '#c9d1d9' }}
                  onClick={() => navigate('/cart')}
                >
                  Перейти до кошика →
                </Button>
              )}
            </div>

            <DescriptionSection>
              <SectionTitle>Про цю книгу</SectionTitle>
              <DescriptionText>{book.description}</DescriptionText>
            </DescriptionSection>
          </Col>
        </Row>

        {relatedBooks.length > 0 && (
          <RelatedSection>
            <SectionTitle>Інші книги з розділу {book.category}</SectionTitle>
            <Row xs={1} sm={2} md={3} className="g-5 mt-1">
              {relatedBooks.map((rb) => (
                <Col key={rb.id}>
                  <BookCard book={rb} />
                </Col>
              ))}
            </Row>
          </RelatedSection>
        )}
      </Container>
    </PageWrapper>
  );
};

export default BookDetails;
