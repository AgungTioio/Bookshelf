let booksData = JSON.parse(localStorage.getItem("books")) || { unread: [], read: [] };
const saveBookButton = document.querySelector("#saveBook");
const clearStorageButton = document.querySelector(".clear-storage-button");
const searchBar = document.querySelector("#search");

function updateBookshelf() {
  const unreadBooksList = document.getElementById("unreadBooks");
  const readBooksList = document.getElementById("readBooks");

  unreadBooksList.innerHTML = "";
  readBooksList.innerHTML = "";

  booksData.unread.forEach((book) => {
    const divItem = createBookElement(book, "unread");
    unreadBooksList.appendChild(divItem);
  });

  booksData.read.forEach((book) => {
    const divItem = createBookElement(book, "read");
    readBooksList.appendChild(divItem);
  });
}

function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(booksData));
}

function saveBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const read = document.getElementById("read").checked;

  const book = { title, author, year };

  if (read) {
    booksData.read.push(book);
  } else {
    booksData.unread.push(book);
  }

  saveToLocalStorage();
  updateBookshelf();

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("read").checked = false;
}

function confirmClearStorage() {
  showAlert("Apakah Anda yakin ingin menghapus seluruh penyimpanan?");
}

function clearStorage() {
  localStorage.removeItem("books");
  location.reload();
}

function acceptAction() {
  clearStorage();
}

function createBookElement(book, shelf) {
  const divItem = document.createElement("div");
  divItem.classList.add("booksList");
  divItem.textContent = `${book.title} - ${book.author} (${book.year})`;

  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("book-actions");

  if (shelf === "unread") {
    const moveToReadButton = document.createElement("img");
    moveToReadButton.setAttribute("src", "icons/circle.svg");
    moveToReadButton.setAttribute("id", "move-to-read");
    moveToReadButton.onclick = function () {
      moveToRead(book);
    };
    actionsContainer.appendChild(moveToReadButton);
  } else if (shelf === "read") {
    const moveToUnreadButton = document.createElement("img");
    moveToUnreadButton.setAttribute("src", "icons/check-circle.svg");
    moveToUnreadButton.setAttribute("id", "move-to-unread");

    moveToUnreadButton.addEventListener("click", function () {
      moveToUnread(book);
    });
    actionsContainer.appendChild(moveToUnreadButton);
  }

  const deleteButton = document.createElement("img");
  deleteButton.setAttribute("src", "icons/trash-2.svg");
  deleteButton.onclick = function () {
    deleteBook(book, shelf);
  };
  actionsContainer.appendChild(deleteButton);

  divItem.appendChild(actionsContainer);

  return divItem;
}

function moveToRead(book) {
  const index = booksData.unread.findIndex((item) => item === book);
  if (index !== -1) {
    booksData.read.push(booksData.unread[index]);
    booksData.unread.splice(index, 1);
    saveToLocalStorage();
    updateBookshelf();
  }
}

function moveToUnread(book) {
  const index = booksData.read.findIndex((item) => item === book);
  if (index !== -1) {
    booksData.unread.push(booksData.read[index]);
    booksData.read.splice(index, 1);
    saveToLocalStorage();
    updateBookshelf();
  }
}

function deleteBook(book, shelf) {
  const shelfName = shelf === "unread" ? "unread" : "read";
  const index = booksData[shelfName].findIndex((item) => item === book);
  if (index !== -1) {
    booksData[shelfName].splice(index, 1);
    saveToLocalStorage();
    updateBookshelf();
  }
}

function searchBooks() {
  const searchTerm = document.getElementById("search").value.trim().toLowerCase();

  const allBooks = [...booksData.unread, ...booksData.read];
  const filteredBooks = allBooks.filter((book) => book.title.toLowerCase().includes(searchTerm));

  const unreadBooksList = document.getElementById("unreadBooks");
  const readBooksList = document.getElementById("readBooks");

  unreadBooksList.innerHTML = "";
  readBooksList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const divItem = createBookElement(book, booksData.read.includes(book) ? "read" : "unread");
    if (booksData.read.includes(book)) {
      readBooksList.appendChild(divItem);
    } else {
      unreadBooksList.appendChild(divItem);
    }
  });
}

function showAlert(message) {
  const alertElement = document.getElementById("customAlert");
  const messageElement = document.getElementById("alertMessage");
  messageElement.textContent = message;
  alertElement.classList.add("show");
}

function hideCustomAlert() {
  const alertElement = document.getElementById("customAlert");
  alertElement.classList.remove("show");
}

updateBookshelf();

saveBookButton.addEventListener("click", () => {
  saveBook();
});

clearStorageButton.addEventListener("click", () => {
  confirmClearStorage();
});

searchBar.addEventListener("input", () => {
  searchBooks();
});
