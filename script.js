const listsContainer = document.querySelector('[data-lists]');
const listTemplate = document.querySelector('#list-template');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();

    if (elementTag === 'li' || elementTag === 'span') {
        selectedListId = e.target.getAttribute('listId');
        saveAndRender();
        return;
    }

    if (elementTag === 'button' &&
        e.target.getAttribute('listId')) {
        lists = lists.filter(list => list.id !== e.target.getAttribute('listId'));
        saveAndRender();
        return;
    }
});

newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
})

function createList(name) {
    return { id: 'list-' + Date.now().toString(), name: name, tasks: [] };
}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
    clearElement(listsContainer);
    renderLists();

}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.importNode(listTemplate.content, true).querySelector('li');

        listElement.setAttribute('listid', list.id);
        listElement.querySelector('span').innerText = list.name;
        listElement.querySelector('span').setAttribute('listid', list.id);
        listElement.querySelector('button').setAttribute('listid', list.id);

        // listElement.addEventListener('click', e => {
        //     selectedListId = list.id;
        //     saveAndRender();
        // });

        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        };

        listsContainer.appendChild(listElement);
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();