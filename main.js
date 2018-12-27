// Book Class: Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentNode.parentNode.remove();
    }
    return;
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className} text-center`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");
    const insertBeforeThis = container.querySelector("#book-form");

    container.insertBefore(div, insertBeforeThis);

    // vanish the alert div in 3 seconds time
    setTimeout(() => div.remove(), 3000);
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (!localStorage.getItem("books")) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = this.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event : Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", e => {
  // Prevent the default submitting behavior of the form
  e.preventDefault();

  // Get the form element
  const form = e.target;

  // Get the form value
  const title = form.querySelector("#title").value;
  const author = form.querySelector("#author").value;
  const isbn = form.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields !", "danger");
  } else {
    // Instantiate book
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to locale storage
    Store.addBook(book);

    // Show success message
    UI.showAlert("Book added", "success");

    // Reset the form after being submiting
    form.reset();
  }
});

// Event: Remove a book
document.querySelector("#book-list").addEventListener("click", e => {
  // Remove book from the UI
  UI.deleteBook(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentNode.previousElementSibling.textContent);
  // Show success message
  UI.showAlert("Book Removed", "success");
});
