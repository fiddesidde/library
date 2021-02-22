let myLibrary = [];

if (localStorage.myLib) {
    const thing = JSON.parse(localStorage.getItem('myLib'));
    for (let book of thing) {
        let { title, author, pages, read, id } = book;
        let newBook = new Book(title, author, pages, read, id);
        myLibrary.push(newBook);
    }
}

const setStorage = () => {
    localStorage.setItem('myLib', JSON.stringify(myLibrary));
};

let isFormOpen = false;

const container = document.querySelector('#container');
const openFormBtn = document.querySelector('#open-form-btn');
const saveBtn = document.querySelector('#save-btn');

function Book(title, author, pages, read = false, id) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = id || Math.round(Math.random() * 10000);

    this.getReadStatus = function () {
        if (this.read) return 'read';
        else return 'not read yet';
    };

    this.toggleReadStatus = function () {
        this.read = !this.read;
    };

    this.info = function () {
        return `${title}, ${author}, ${pages}, ${getReadStatus()}`;
    };
}

const createCardFromBook = book => {
    const { title, author, pages, read, id } = book;

    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id;

    const titleH3 = document.createElement('h3');
    titleH3.className = 'title';
    titleH3.textContent = title;

    const authorDiv = document.createElement('div');
    authorDiv.className = 'author';
    authorDiv.textContent = author;

    const pagesDiv = document.createElement('div');
    pagesDiv.className = 'pages';
    pagesDiv.textContent = `Pages: ${pages.toString()}`;

    const readDiv = document.createElement('div');
    readDiv.textContent = 'Read:';
    readDiv.className = 'read';
    const readInp = document.createElement('input');
    readInp.className = 'isRead';
    readInp.type = 'checkbox';
    if (read) readInp.checked = true;
    readInp.addEventListener('change', () => {
        book.toggleReadStatus();
        setStorage();
    });
    readDiv.appendChild(readInp);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete Book';
    delBtn.className = 'delBtn';
    delBtn.addEventListener('click', () => {
        deleteBook(id);
    });

    card.appendChild(titleH3);
    card.appendChild(authorDiv);
    card.appendChild(pagesDiv);
    card.appendChild(readDiv);
    card.appendChild(delBtn);

    return card;
};

const renderBooksInMyLibrary = () => {
    for (let book of myLibrary) {
        let card = createCardFromBook(book);
        container.appendChild(card);
    }
};

const addBookToLibrary = (title, author, pages, read) => {
    const book = new Book(title, author, pages, read);
    myLibrary = myLibrary.concat(book);
    setStorage();
    return book;
};

const createNewBook = () => {
    formTitle = document.querySelector('#form-title');
    formAuthor = document.querySelector('#form-author');
    formPages = document.querySelector('#form-pages');
    formRead = document.querySelector('#form-read');

    const book = addBookToLibrary(
        formTitle.value,
        formAuthor.value,
        Number(formPages.value),
        formRead.checked
    );
    const card = createCardFromBook(book);
    container.appendChild(card);

    formTitle.value = '';
    formAuthor.value = '';
    formPages.value = '';
    formRead.checked = false;
};

const toggleForm = () => {
    if (isFormOpen) {
        document.querySelector('#form-div').style.display = 'none';
        openFormBtn.style.backgroundColor = 'lightgreen';
        openFormBtn.textContent = 'New Book';
    } else {
        document.querySelector('#form-div').style.display = 'block';
        openFormBtn.style.backgroundColor = 'rgb(250, 94, 94)';
        openFormBtn.textContent = 'Close Form';
    }
    isFormOpen = !isFormOpen;
};

const deleteBook = id => {
    card = document.querySelector(`[data-id="${id}"`);
    container.removeChild(card);
    myLibrary = myLibrary.filter(book => book.id !== id);
    setStorage();
};

openFormBtn.addEventListener('click', toggleForm);
saveBtn.addEventListener('click', createNewBook);

renderBooksInMyLibrary();
if (myLibrary.length === 0) {
    toggleForm();
}
