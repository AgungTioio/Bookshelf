const booksData = JSON.parse(localStorage.getItem("books")) || { unread: [], read: [] };

function updateBookshelf() {
  const unreadBooksList = document.getElementById("unreadBooks");
  const readBooksList = document.getElementById("readBooks");

  unreadBooksList.innerHTML = "";
  readBooksList.innerHTML = "";

  booksData.unread.forEach((book) => {
    const divItem = document.createElement("div");

    // ubah return element
    divItem.textContent = `${book.title} - ${book.author} (${book.year})`;
    unreadBooksList.appendChild(divItem);
  });

  booksData.read.forEach((book) => {
    const divItem = document.createElement("div");
    // ubah return element
    divItem.textContent = `${book.title} - ${book.author} (${book.year})`;
    readBooksList.appendChild(divItem);
  });
}

function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(booksData));
}

function confirmClearStorage() {
  const isConfirmed = confirm("Apakah Anda yakin ingin menghapus seluruh penyimpanan?");
  if (isConfirmed) {
    clearStorage();
  }
}

function clearStorage() {
  localStorage.removeItem("books");
  location.reload(); // Refresh halaman untuk memperbarui rak buku
}

function saveBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const read = document.getElementById("read").checked;

  const book = {
    title: title,
    author: author,
    year: year,
  };

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

updateBookshelf();
