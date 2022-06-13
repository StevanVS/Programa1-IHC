const listsContainer = document.querySelector('[data-lists]');
const listTemplate = document.querySelector('#list-template');

let lists = [{
        name: 'Proyecto',
        id: 'list-' + Date.now().toString(),
        tasks: []
    }];

function render() {
    clearElement(listsContainer);
    renderLists();
    

}

function renderLists() {
    lists.forEach(list =>{
        const listElement = document.importNode(listTemplate.content, true);

        listElement.querySelector('li').dataset.listId = list.id; 
        listElement.querySelector('span').innerText = list.name;
        listElement.querySelector('button').setAttribute('listid', list.id);

        listsContainer.appendChild(listElement);
    });
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

render();