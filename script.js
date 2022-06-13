const listsContainer = document.querySelector('[data-lists]');
const listTemplate = document.querySelector('#list-template');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const listDisplayContainer = document.querySelector('[data-list-display-container]');
const listTitleElement = document.querySelector('[data-list-title]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.querySelector('#task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');

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
    if (elementTag === 'button') {
        lists = lists.filter(list => list.id !== e.target.getAttribute('listId'));
        if (selectedListId === e.target.getAttribute('listId')) {
            selectedListId = null;
        }
        saveAndRender();
        return;
    }
});

tasksContainer.addEventListener('click', e => {
    const elementTag = e.target.tagName.toLowerCase();
    if (elementTag === 'input') {
        const selectedTask = getSelectedTask(e);
        selectedTask.complete = e.target.checked;
        save();
        return;
    }
    if (elementTag === 'button') {
        const selectedList = lists.find(list => list.id === selectedListId);
        selectedList.tasks = selectedList.tasks.filter(task => task.id !== e.target.getAttribute('taskid'));
        saveAndRender();
        return;
    }
});

tasksContainer.addEventListener('input', e => {
    if (e.target.tagName.toLowerCase() === 'span') {
        const selectedTask = getSelectedTask(e);
        selectedTask.name = e.target.innerText;
        save();
    }
});

newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    selectedListId = list.id;
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    const taskName = newTaskInput.value;
    if (taskName == null || taskName === '') return;
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});

function createList(name) {
    return { id: 'list-' + Date.now().toString(), name: name, tasks: [] };
}

function createTask(name) {
    return { id: 'task-' + Date.now().toString(), name: name, complete: false };
}

function getSelectedTask(event) {
    const selectedList = lists.find(list => list.id === selectedListId);
    return selectedList.tasks.find(task => task.id === event.target.getAttribute('taskid'));
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

    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none';
    } else {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true).querySelector('li');
        taskElement.setAttribute('taskid', task.id);

        const checkbox = taskElement.querySelector('input');
        checkbox.setAttribute('taskid', task.id);
        checkbox.checked = task.complete;

        const taskName = taskElement.querySelector('span');
        taskName.innerText = task.name;
        taskName.setAttribute('taskid', task.id);

        taskElement.querySelector('button').setAttribute('taskid', task.id);

        tasksContainer.appendChild(taskElement);
    });
}


function renderLists() {
    lists.forEach(list => {
        const listElement = document.importNode(listTemplate.content, true).querySelector('li');
        listElement.setAttribute('listid', list.id);

        const listName = listElement.querySelector('span');
        listName.innerText = list.name;
        listName.setAttribute('listid', list.id);

        listElement.querySelector('button').setAttribute('listid', list.id);
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