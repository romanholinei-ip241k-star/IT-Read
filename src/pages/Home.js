import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import BookCard from '../components/BookCard';
import { getFeaturedBooks } from '../services/bookService';


const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;


const HeroSection = styled.section`
  background: linear-gradient(135deg, #0d1117 0%, #1c2333 50%, #0d1117 100%);
  min-height: 85vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(88, 166, 255, 0.07) 0%, transparent 70%);
    border-radius: 50%;
  }
`;

const HeroContent = styled.div`
  animation: ${fadeInUp} 0.7s ease both;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 800;
  color: #f0f6fc;
  line-height: 1.15;
  margin-bottom: 1.25rem;

  span {
    color: #58a6ff;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.15rem;
  color: #8b949e;
  max-width: 520px;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled(Button)`
  background: #58a6ff;
  border-color: #58a6ff;
  color: #0d1117;
  font-weight: 600;
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  font-size: 1rem;

  &:hover {
    background: #79c0ff;
    border-color: #79c0ff;
    color: #0d1117;
  }
`;

const SecondaryBtn = styled(Button)`
  border-color: #30363d;
  color: #c9d1d9;
  font-weight: 600;
  padding: 0.65rem 1.6rem;
  border-radius: 8px;
  font-size: 1rem;
  background: transparent;

  &:hover {
    background: #30363d;
    border-color: #58a6ff;
    color: #f0f6fc;
  }
`;

const StatBadge = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: rgba(88, 166, 255, 0.06);
  border: 1px solid #30363d;
  border-radius: 10px;
  min-width: 90px;
`;

const StatNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #58a6ff;
`;

const StatLabel = styled.span`
  font-size: 0.72rem;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.4rem;
`;

const SectionSubtitle = styled.p`
  color: #8b949e;
  margin-bottom: 2rem;
`;

const FeaturedSection = styled.section`
  padding: 4rem 0;
  background: #0d1117;
`;

const CategoryPill = styled(Button)`
  border-radius: 20px;
  padding: 0.35rem 1rem;
  font-size: 0.82rem;
  font-weight: 600;
  background: rgba(88, 166, 255, 0.08);
  border-color: #30363d;
  color: #58a6ff;
  margin: 0.2rem;

  &:hover {
    background: #58a6ff;
    border-color: #58a6ff;
    color: #0d1117;
  }
`;

const CategorySection = styled.section`
  padding: 3rem 0;
  background: #161b22;
  border-top: 1px solid #30363d;
  border-bottom: 1px solid #30363d;
`;


const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['JavaScript', 'React', 'Python', 'C#', 'Architecture', 'DevOps'];

  useEffect(() => {
    getFeaturedBooks(6).then((books) => {
      setFeaturedBooks(books);
      setLoading(false);
    });
  }, []);

  return (
    <>

      <HeroSection>
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <HeroContent>
                <HeroTitle>
                  Прокачай свої <span>технічні навички</span>
                  <br />
                  Одна книга за раз
                </HeroTitle>
                <HeroSubtitle>
                  Відібрані книги з JavaScript, React, Python, архітектури та не тільки.
                  Для розробників, які серйозно ставляться до навчання.
                </HeroSubtitle>

                <HeroButtons>
                  <PrimaryBtn onClick={() => navigate('/catalog')}>
                    Переглянути каталог
                  </PrimaryBtn>
                  <SecondaryBtn onClick={() => navigate('/register')}>
                    Почати безкоштовно
                  </SecondaryBtn>
                </HeroButtons>

                <div className="d-flex gap-3 mt-4 flex-wrap">
                  {[
                    { num: '15+', label: 'Книг' },
                    { num: '6', label: 'Категорій' },
                    { num: '4.7★', label: 'Середній рейтинг' },
                  ].map(({ num, label }) => (
                    <StatBadge key={label}>
                      <StatNumber>{num}</StatNumber>
                      <StatLabel>{label}</StatLabel>
                    </StatBadge>
                  ))}
                </div>
              </HeroContent>
            </Col>
          </Row>
        </Container>
      </HeroSection>

      <CategorySection>
        <Container className="text-center">
          <SectionTitle>Огляд за категоріями</SectionTitle>
          <SectionSubtitle>Знайдіть саме ту нішу, яку хочете опанувати</SectionSubtitle>
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              onClick={() => navigate(`/catalog?category=${encodeURIComponent(cat)}`)}
            >
              {cat}
            </CategoryPill>
          ))}
        </Container>
      </CategorySection>

      <FeaturedSection>
        <Container>
          <SectionTitle>Рекомендовані книги</SectionTitle>
          <SectionSubtitle>Найкращі вибори з нашої колекції</SectionSubtitle>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} className="g-5">
              {featuredBooks.map((book) => (
                <Col key={book.id}>
                  <BookCard book={book} />
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-4">
            <PrimaryBtn onClick={() => navigate('/catalog')}>
              Переглянути всі книги →
            </PrimaryBtn>
          </div>
        </Container>
      </FeaturedSection>
    </>
  );
};

export default Home;
