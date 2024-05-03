// Mengecek apakah terdapat data buku dalam local storage
let booksData = JSON.parse(localStorage.getItem("books")) || { unread: [], read: [] };

// Memperbarui rak buku
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

// Simpan data buku ke local storage
function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(booksData));
}

// Menyimpan buku
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

  // Clear form inputs
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("read").checked = false;
}

function confirmClearStorage() {
  showAlert("Apakah Anda yakin ingin menghapus seluruh penyimpanan?");
}

// Menghapus seluruh penyimpanan dalam local storage
function clearStorage() {
  localStorage.removeItem("books");
  location.reload(); // Refresh halaman untuk memperbarui rak buku
}

function acceptAction() {
  clearStorage();
}

// Membuat elemen div untuk buku
function createBookElement(book, shelf) {
  const divItem = document.createElement("div");
  divItem.textContent = `${book.title} - ${book.author} (${book.year})`;

  const actionsContainer = document.createElement("div");
  actionsContainer.classList.add("book-actions");

  if (shelf === "unread") {
    const moveToReadButton = document.createElement("button");
    moveToReadButton.textContent = "Tandai sudah dibaca";
    moveToReadButton.onclick = function () {
      moveToRead(book);
    };
    actionsContainer.appendChild(moveToReadButton);
  } else if (shelf === "read") {
    const moveToUnreadButton = document.createElement("button");
    moveToUnreadButton.textContent = "Tandai belum dibaca";
    moveToUnreadButton.onclick = function () {
      moveToUnread(book);
    };
    actionsContainer.appendChild(moveToUnreadButton);
  }

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Hapus";
  deleteButton.onclick = function () {
    deleteBook(book, shelf);
  };
  actionsContainer.appendChild(deleteButton);

  divItem.appendChild(actionsContainer);

  return divItem;
}

// Memindahkan buku dari rak belum dibaca ke rak sudah dibaca
function moveToRead(book) {
  const index = booksData.unread.findIndex((item) => item === book);
  if (index !== -1) {
    booksData.read.push(booksData.unread[index]);
    booksData.unread.splice(index, 1);
    saveToLocalStorage();
    updateBookshelf();
  }
}

// Memindahkan buku dari rak sudah dibaca ke rak belum dibaca
function moveToUnread(book) {
  const index = booksData.read.findIndex((item) => item === book);
  if (index !== -1) {
    booksData.unread.push(booksData.read[index]);
    booksData.read.splice(index, 1);
    saveToLocalStorage();
    updateBookshelf();
  }
}

// Menghapus buku dari rak buku
function deleteBook(book, shelf) {
  const shelfName = shelf === "unread" ? "unread" : "read";
  const index = booksData[shelfName].findIndex((item) => item === book);
  if (index !== -1) {
    booksData[shelfName].splice(index, 1);
    saveToLocalStorage();
    updateBookshelf();
  }
}

// Mencari buku berdasarkan judul
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

// Menampilkan alert kustom
function showAlert(message) {
  const alertElement = document.getElementById("customAlert");
  const messageElement = document.getElementById("alertMessage");
  messageElement.textContent = message;
  alertElement.classList.add("show");
}

// Menyembunyikan alert kustom
function hideCustomAlert() {
  const alertElement = document.getElementById("customAlert");
  alertElement.classList.remove("show");
}

// Memanggil fungsi updateBookshelf() untuk menampilkan rak buku saat halaman dimuat
updateBookshelf();
