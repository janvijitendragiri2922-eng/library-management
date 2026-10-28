"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./globals.css";
import Navbar from "../component/nav.jsx";

type Book = {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  discount:number;

  status: "Available" | "Issued";
};

const defaultBooks: Book[] = [
  {
    id: 1,
    title: "Fundamental of Computer",
    author: "E. Balagurusamy",
    category: "Computer Fundamentals",
    price: 499,
      discount:5,
    status: "Available",
  },
  {
    id: 2,
    title: "Web Development",
    author: "Jon Duckett",
    category: "HTML, CSS and JavaScript",
    price: 599,
      discount:5,
    status: "Available",
  },
  {
    id: 3,
    title: "Data Analyst",
    author: "Dhairya Parikh",
    category: "Machine Learning Python Analytics",
    price: 1599,
      discount:5,
    status: "Available",
  },
  {
    id: 4,
    title: "Discrete Mathematics",
    author: "Babu Ram",
    category: "Discrete Mathematics",
    price: 767,
      discount:5,
    status: "Available",
  },
  {
    id: 5,
    title: "Java",
    author: "Joshua Bloch",
    category: "Java Expert",
    price: 1767,
    discount:5,
    status: "Available",
  },
];

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>(defaultBooks);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    discount:"",
  });

  //login check
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn !== "true") {
     
      router.replace("/login");
    } else {
      console.log("User already logged in");
    }
  }, [router]);

  // Load books from localStorage
  useEffect(() => {
    console.log("Load Book ");
    const savedBooks = localStorage.getItem("libraryBooks");

    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      localStorage.setItem("libraryBooks", JSON.stringify(defaultBooks));
      console.log("Default book save in localstorage");
    }
  }, []);

  // Save books
  useEffect(() => {
    console.log("Save book fun run");
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  // Open Add Book popup
  const openAddModal = () => {
    setEditingBook(null);

    setForm({
      title: "",
      author: "",
      category: "",
      price: "",
      discount:"",
    });

    setShowModal(true);
  };

  // Open Edit popup
  const openEditModal = (book: Book) => {
    setEditingBook(book);

    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: book.price.toString(),
      discount: book.discount.toString(),
    });

    setShowModal(true);
    console.log("Add book popup open");
  };

  // Form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update book
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !form.category.trim() ||
      !form.price
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingBook) {
      setBooks(
        books.map((book) =>
          book.id === editingBook.id
            ? {
                ...book,
                title: form.title,
                author: form.author,
                category: form.category,
                price: Number(form.price),
              }
            : book,
        ),
      );

      alert("Book updated successfully!");
    } else {
      const newId =
        books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

      const newBook: Book = {
        id: newId,
        title: form.title,
        author: form.author,
        category: form.category,
        price: Number(form.price),
        discount:Number(form.discount),
        status: "Available",
      };

      setBooks([...books, newBook]);

      alert("Book added successfully!");
    }

    setShowModal(false);

    setForm({
      title: "",
      author: "",
      category: "",
      price: "",
      discount:"",
     
    });
  };

  // Delete book
  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmDelete) return;

    setBooks(books.filter((book) => book.id !== id));

    alert("Book deleted successfully!");
  };

  // Issue book
  const openIssueModal = (book: Book) => {
    if (book.status === "Issued") {
      alert("This book is already issued.");
      return;
    }

    setSelectedBook(book);
    setShowIssueModal(true);
  };

  const issueBook = () => {
    if (!selectedBook) return;

    setBooks(
      books.map((book) =>
        book.id === selectedBook.id
          ? {
              ...book,
              status: "Issued",
            }
          : book,
      ),
    );

    setShowIssueModal(false);
    setSelectedBook(null);

    alert("Book issued successfully!");
  };

  // Search + Category Filter
  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText) ||
      book.category.toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" || book.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalBooks = books.length;

  const availableBooks = books.filter(
    (book) => book.status === "Available",
  ).length;

  const issuedBooks = books.filter((book) => book.status === "Issued").length;

  const categories = [
    "All",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];

  return (
    <div className="library-app">
      <Navbar />

      <main className="main-content">
        <div className="page-heading">
          <div>
            <h1>All Books</h1>
            <p>Manage all books in the library</p>
          </div>

          <button className="add-book-btn " onClick={openAddModal}>
            ＋ Add Book
          </button>
        </div>
        <section className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📚</div>

            <div className="stat-info">
              <span className="stat-title">Total Books</span>

              <span className="stat-number">{books.length}</span>
              <span className="stat-description">All books in library</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon ">✓</div>

            <div className="stat-info">
              <span className="stat-title">Available Books</span>
              <span className="stat-number">
                {books.filter((book) => book.status === "Available").length}
              </span>
              <span className="stat-description">Books available</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">↗</div>

            <div className="stat-info">
              <span className="stat-title">Issued Books</span>
              <span className="stat-number">
                {books.filter((book) => book.status === "Issued").length}
              </span>
              <span className="stat-description">Books issued</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">▦</div>

            <div className="stat-info">
              <span className="stat-title">Categories</span>
              <span className="stat-number">
                {new Set(books.map((book) => book.category)).size}
              </span>
              <span className="stat-description">Total categories</span>
            </div>
          </div>
        </section>

        <section className="books-section">
          <div className="search-filter">
            <div className="search-box">
              <span className="search-icon">🔍</span>

              <input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-books">
                      No books found.
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book.id}>
                      <td>{book.id}</td>

                      <td className="book-title">{book.title}</td>

                      <td>{book.author}</td>

                      <td>{book.category}</td>

                      <td>₹{(book.price)}</td>
                      <td>
                        <span>5% OFF</span>
                        <br/>
                        <small>Save: ₹ {(book.price*0.05).toFixed(2)}</small>
                      </td>

                      <td>
                        <span
                          className={
                            book.status === "Available"
                              ? "status available"
                              : "status issued"
                          }
                        >
                          {book.status}
                        </span>
                      </td>

                      <td>
                        <div className="book-actions">
                          {/* EDIT */}
                          <button
                            className="edit"
                            title="Edit"
                            onClick={() => openEditModal(book)}
                          >
                            ✏️
                          </button>

                          {/* DELETE */}
                          <button
                            className="delete"
                            title="Delete"
                            onClick={() => handleDelete(book.id)}
                          >
                            🗑️
                          </button>
                         

                          {/* ISSUE / RETURN */}
                          {book.status === "Available" ? (
                            <button
                              className="issue"
                              title="Issue Book"
                              onClick={() => openIssueModal(book)}
                            >
                              📤
                            </button>
                          ) : (
                            <button className="return" title="Return Book">
                              📥
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>

              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Book Title</label>

              <input
                type="text"
                name="title"
                placeholder="Enter book title"
                value={form.title}
                onChange={handleChange}
              />

              <label>Author</label>

              <input
                type="text"
                name="author"
                placeholder="Enter author name"
                value={form.author}
                onChange={handleChange}
              />

              <label>Category</label>

              <input
                type="text"
                name="category"
                placeholder="Enter category"
                value={form.category}
                onChange={handleChange}
              />

              <label>Price</label>

              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={form.price}
                onChange={handleChange}
              />

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showIssueModal && selectedBook && (
        <div className="modal-overlay">
          <div className="modal small-modal">
            <div className="modal-header">
              <h2>Issue Book</h2>

              <button
                className="close-btn"
                onClick={() => setShowIssueModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="issue-content">
              <p>Are you sure you want to issue:</p>

              <h3>{selectedBook.title}</h3>

              <p>Author: {selectedBook.author}</p>
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowIssueModal(false)}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={issueBook}>
                Issue Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
