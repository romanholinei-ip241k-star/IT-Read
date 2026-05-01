import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Badge,
  InputGroup,
} from 'react-bootstrap';
import styled from 'styled-components';
import { getBooks, addBook, updateBook, deleteBook } from '../../services/bookService';

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.3rem;
`;

const Subtitle = styled.p`
  color: #8b949e;
  margin-bottom: 1.5rem;
`;

const StyledTable = styled(Table)`
  color: #c9d1d9;

  thead th {
    color: #8b949e;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-color: #30363d;
    background: #161b22;
    white-space: nowrap;
  }

  tbody tr {
    border-color: #21262d;

    &:hover {
      background: rgba(88, 166, 255, 0.04);
    }
  }

  td {
    vertical-align: middle;
    border-color: #21262d;
  }
`;

const ActionBtn = styled(Button)`
  font-size: 0.78rem;
  padding: 0.25rem 0.6rem;
  margin-right: 0.3rem;
`;

const DarkModal = styled(Modal)`
  .modal-content {
    background: #161b22;
    border: 1px solid #30363d;
    color: #c9d1d9;
  }

  .modal-header,
  .modal-footer {
    border-color: #30363d;
  }

  .modal-title {
    color: #f0f6fc;
  }

  .form-label {
    color: #c9d1d9;
    font-size: 0.85rem;
  }

  .form-control,
  .form-select {
    background: #0d1117;
    border-color: #30363d;
    color: #f0f6fc;

    &:focus {
      background: #0d1117;
      border-color: #58a6ff;
      color: #f0f6fc;
      box-shadow: none;
    }

    &::placeholder {
      color: #484f58;
    }
  }
`;

const EMPTY_FORM = {
  title: '',
  author: '',
  price: '',
  category: '',
  rating: '',
  pages: '',
  publisher: '',
  year: '',
  description: '',
  coverImage: '',
};

const CATEGORIES = ['JavaScript', 'React', 'Python', 'C#', 'Architecture', 'DevOps'];


const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingBook(null);
    setFormData(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      price: book.price || '',
      category: book.category || '',
      rating: book.rating || '',
      pages: book.pages || '',
      publisher: book.publisher || '',
      year: book.year || '',
      description: book.description || '',
      coverImage: book.coverImage || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Назва та автор обов\'язкові.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        rating: parseFloat(formData.rating) || 0,
        pages: parseInt(formData.pages, 10) || 0,
        publisher: formData.publisher.trim(),
        year: parseInt(formData.year, 10) || new Date().getFullYear(),
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim(),
      };

      if (editingBook) {
        await updateBook(editingBook.id, payload);
      } else {
        await addBook(payload);
      }

      setShowModal(false);
      await loadBooks();
    } catch (err) {
      setError('Помилка збереження. Спробуйте ще раз.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      setDeleteConfirm(null);
      await loadBooks();
    } catch {
      setError('Помилка видалення.');
    }
  };

  return (
    <>
      <PageTitle>Управління книгами</PageTitle>
      <Subtitle>Додавайте, редагуйте та видаляйте книги каталогу</Subtitle>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <InputGroup style={{ maxWidth: 320 }}>
          <Form.Control
            placeholder="Пошук за назвою або автором…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: '#161b22', borderColor: '#30363d', color: '#f0f6fc' }}
          />
        </InputGroup>
        <Button
          style={{ background: '#238636', borderColor: '#238636', fontWeight: 600 }}
          onClick={openCreate}
        >
          + Додати книгу
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <StyledTable hover borderless>
            <thead>
              <tr>
                <th>#</th>
                <th>Назва / Автор</th>
                <th>Категорія</th>
                <th>Ціна</th>
                <th>Рейтинг</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book, idx) => (
                <tr key={book.id}>
                  <td style={{ color: '#484f58', fontSize: '0.8rem' }}>{idx + 1}</td>
                  <td>
                    <div style={{ color: '#f0f6fc', fontWeight: 500 }}>{book.title}</div>
                    <div style={{ color: '#8b949e', fontSize: '0.8rem' }}>{book.author}</div>
                  </td>
                  <td>
                    <Badge bg="secondary" style={{ fontSize: '0.72rem' }}>
                      {book.category}
                    </Badge>
                  </td>
                  <td style={{ color: '#3fb950', fontWeight: 600 }}>
                    ${Number(book.price).toFixed(2)}
                  </td>
                  <td style={{ color: '#f0a030' }}>★ {book.rating}</td>
                  <td>
                    <ActionBtn variant="outline-primary" size="sm" onClick={() => openEdit(book)}>
                      Редагувати
                    </ActionBtn>
                    <ActionBtn
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setDeleteConfirm(book)}
                    >
                      Видалити
                    </ActionBtn>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4" style={{ color: '#8b949e' }}>
                    Книги не знайдено
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      <DarkModal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>{editingBook ? 'Редагування книги' : 'Нова книга'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {error && <Alert variant="danger" style={{ fontSize: '0.85rem' }}>{error}</Alert>}

            <div className="row g-3">
              <div className="col-md-8">
                <Form.Label>Назва *</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={handleFormChange} required />
              </div>
              <div className="col-md-4">
                <Form.Label>Категорія</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleFormChange}>
                  <option value="">— обрати —</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-8">
                <Form.Label>Автор *</Form.Label>
                <Form.Control name="author" value={formData.author} onChange={handleFormChange} required />
              </div>
              <div className="col-md-4">
                <Form.Label>Видавець</Form.Label>
                <Form.Control name="publisher" value={formData.publisher} onChange={handleFormChange} />
              </div>
              <div className="col-md-3">
                <Form.Label>Ціна ($)</Form.Label>
                <Form.Control type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleFormChange} />
              </div>
              <div className="col-md-3">
                <Form.Label>Рейтинг (0–5)</Form.Label>
                <Form.Control type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleFormChange} />
              </div>
              <div className="col-md-3">
                <Form.Label>Сторінок</Form.Label>
                <Form.Control type="number" min="1" name="pages" value={formData.pages} onChange={handleFormChange} />
              </div>
              <div className="col-md-3">
                <Form.Label>Рік</Form.Label>
                <Form.Control type="number" min="1900" max="2100" name="year" value={formData.year} onChange={handleFormChange} />
              </div>
              <div className="col-12">
                <Form.Label>URL обкладинки</Form.Label>
                <Form.Control name="coverImage" placeholder="https://…" value={formData.coverImage} onChange={handleFormChange} />
              </div>
              <div className="col-12">
                <Form.Label>Опис</Form.Label>
                <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleFormChange} />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Скасувати
            </Button>
            <Button
              type="submit"
              style={{ background: '#238636', borderColor: '#238636' }}
              disabled={saving}
            >
              {saving ? 'Збереження…' : 'Зберегти'}
            </Button>
          </Modal.Footer>
        </Form>
      </DarkModal>

      {/* ── Delete Confirm Modal ── */}
      <DarkModal show={!!deleteConfirm} onHide={() => setDeleteConfirm(null)} centered>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Видалення книги</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ви впевнені, що хочете видалити{' '}
          <strong style={{ color: '#f0f6fc' }}>{deleteConfirm?.title}</strong>?
          Цю дію неможливо скасувати.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Скасувати
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm?.id)}>
            Видалити
          </Button>
        </Modal.Footer>
      </DarkModal>
    </>
  );
};

export default AdminBooks;
