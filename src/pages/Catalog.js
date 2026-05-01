import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import BookCard from '../components/BookCard';
import { getBooks, getCategories } from '../services/bookService';


const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0d1117;
  padding: 2.5rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.3rem;
`;

const PageSubtitle = styled.p`
  color: #8b949e;
  margin-bottom: 0;
`;

const FilterPanel = styled.div`
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  padding: 1.25rem;
  position: sticky;
  top: 80px;
`;

const FilterTitle = styled.h6`
  color: #f0f6fc;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
  margin-bottom: 0.75rem;
`;

const CategoryBtn = styled(Button)`
  display: block;
  width: 100%;
  text-align: left;
  margin-bottom: 0.3rem;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background: ${({ $active }) =>
    $active ? 'rgba(88, 166, 255, 0.15)' : 'transparent'};
  border-color: ${({ $active }) => ($active ? '#58a6ff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#58a6ff' : '#c9d1d9')};

  &:hover {
    background: rgba(88, 166, 255, 0.1);
    border-color: #58a6ff;
    color: #58a6ff;
  }
`;

const ResultsCount = styled.p`
  color: #8b949e;
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled(Form.Control)`
  background: #161b22;
  border-color: #30363d;
  color: #f0f6fc;
  border-radius: 8px 0 0 8px;

  &:focus {
    background: #161b22;
    border-color: #58a6ff;
    color: #f0f6fc;
    box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.15);
  }

  &::placeholder {
    color: #484f58;
  }
`;

const ClearBtn = styled(Button)`
  border-color: #30363d;
  color: #8b949e;
  background: #161b22;
  font-size: 0.82rem;

  &:hover {
    background: #30363d;
    color: #f0f6fc;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: #8b949e;

  h4 {
    color: #f0f6fc;
    margin-bottom: 0.5rem;
  }
`;


const Catalog = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'Всі';

  useEffect(() => {
    Promise.all([getBooks(), getCategories()]).then(([books, cats]) => {
      setAllBooks(books);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const handleCategoryChange = useCallback(
    (cat) => {
      if (cat === 'Всі') {
        setSearchParams({});
      } else {
        setSearchParams({ category: cat });
      }
    },
    [setSearchParams]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const filteredBooks = useMemo(() => {
    let result = allBooks;

    if (activeCategory && activeCategory !== 'Всі') {
      result = result.filter(
        (b) => b.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allBooks, activeCategory, searchQuery]);

  return (
    <PageWrapper>
      <Container>
        <Row className="mb-4 align-items-end">
          <Col>
            <PageTitle>Каталог книг</PageTitle>
            <PageSubtitle>Перегляньте повну колекцію ІТ-книг</PageSubtitle>
          </Col>
        </Row>

        <Row className="g-5">
          <Col lg={2} md={3}>
            <FilterPanel>
              <FilterTitle>Категорія</FilterTitle>
              {categories.map((cat) => (
                <CategoryBtn
                  key={cat}
                  $active={activeCategory === cat}
                  variant="ghost"
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </CategoryBtn>
              ))}
            </FilterPanel>
          </Col>

          <Col lg={10} md={9}>
            <InputGroup className="mb-3">
              <SearchInput
                type="text"
                placeholder="Пошук за назвою, автором або ключовим словом…"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <ClearBtn variant="outline-secondary" onClick={handleClearSearch}>
                  ✕
                </ClearBtn>
              )}
            </InputGroup>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                <ResultsCount>
                  Знайдено {filteredBooks.length} книг
                  {activeCategory !== 'Всі' && ` у «${activeCategory}»`}
                  {searchQuery && ` за запитом «${searchQuery}»`}
                </ResultsCount>

                {filteredBooks.length === 0 ? (
                  <EmptyState>
                    <h4>Книги не знайдено</h4>
                    <p>Спробуйте змінити запит або обрати іншу категорію.</p>
                  </EmptyState>
                ) : (
                  <Row xs={1} sm={2} xl={3} className="g-5">
                    {filteredBooks.map((book) => (
                      <Col key={book.id}>
                        <BookCard book={book} />
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Catalog;
