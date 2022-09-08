const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKLIST_APPS";

function existStorage() {
  if (typeof Storage === undefined) {
    alert("Maaf Browser Anda Tidak Mendukung Storage");
    return false;
  }
  return true;
}

function dataSave() {
  if (existStorage()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});


function fromDataStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    listBook();
  });

  if (existStorage()) {
    fromDataStorage();
  }
});

function listBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const checkbook = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generatedId();
  const bookObject = generatedBook(generatedID, title, author, year, checkbook);
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  dataSave();
}

function generatedId() {
  return +new Date();
}

function generatedBook(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

function addTaskToCompleted(bookId) {
  const bookTarget = moveBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  dataSave();
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = deleteBook(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  dataSave();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = moveBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  dataSave();
}

function addBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = "judul buku :" + bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "penulis buku :" + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "tahun :" + bookObject.year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute("id", `book-${bookObject.id}`);

  const completedButton = document.createElement("button");
  completedButton.classList.add("green");
  if (bookObject.isCompleted) {
    completedButton.innerText = "belom selesai di baca";
    completedButton.addEventListener("click", function () {
      undoTaskFromCompleted(bookObject.id);
    });
  } else {
    completedButton.innerText = "sudah selesai di baca";
    completedButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });
  }
  completedButton.addEventListener("click", function () {});

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.innerText = "hapus";
  deleteButton.addEventListener("click", function () {
    removeTaskFromCompleted(bookObject.id);
  });

  const containerButton = document.createElement("div");
  containerButton.classList.add("action");
  containerButton.append(completedButton, deleteButton);

  container.append(containerButton);

  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBOOKList = document.getElementById("incompleteBookshelfList");
  incompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completeBookshelfList");
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = addBook(bookItem);
    if (!bookItem.isCompleted) incompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});

function moveBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function deleteBook(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}
