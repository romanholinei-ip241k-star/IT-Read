import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const BOOKS_COL = 'books';

const booksRef = () => collection(db, BOOKS_COL);

const docToBook = (snap) => ({ id: snap.id, ...snap.data() });

export const getBooks = async () => {
  const snap = await getDocs(query(booksRef(), orderBy('title')));
  return snap.docs.map(docToBook);
};

export const getBookById = async (id) => {
  const snap = await getDoc(doc(db, BOOKS_COL, String(id)));
  return snap.exists() ? docToBook(snap) : null;
};

export const getBooksByCategory = async (category) => {
  if (!category || category === 'All') return getBooks();
  const snap = await getDocs(
    query(booksRef(), where('category', '==', category), orderBy('title'))
  );
  return snap.docs.map(docToBook);
};

export const getCategories = async () => {
  const snap = await getDocs(booksRef());
  const unique = [...new Set(snap.docs.map((d) => d.data().category))].sort();
  return ['Всі', ...unique];
};

export const getFeaturedBooks = async (lim = 6) => {
  const snap = await getDocs(query(booksRef(), firestoreLimit(lim)));
  return snap.docs.map(docToBook);
};

// ── Admin CRUD ──────────────────────────────────────────────────
export const addBook = async (bookData) => {
  const ref = await addDoc(booksRef(), bookData);
  return ref.id;
};

export const updateBook = async (id, bookData) => {
  await updateDoc(doc(db, BOOKS_COL, String(id)), bookData);
};

export const deleteBook = async (id) => {
  await deleteDoc(doc(db, BOOKS_COL, String(id)));
};
