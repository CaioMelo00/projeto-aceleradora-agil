// Referências Iniciais
const inputNewTask = document.querySelector("#inputNewTask");
const listSelection = document.querySelector("#listSelection");
const btnAddTask = document.querySelector("#btnAddTask");
const taskList = document.querySelector("#taskList");
const KEY_CODE_ENTER = 13;
const KEY_LOCAL_STORAGE = 'tasksList';
let dbTasks = [];

// Chamada de funções 
obtainTasksLocalStorage();
renderTaskListHtml();


/* Manipulação de evento para quando o botão Enter do teclado for pressionado
chamar KEY_CODE_ENTER*/
inputNewTask.addEventListener('keypress', (e) => {

    if(e.keyCode == KEY_CODE_ENTER) {
        let task = {
            name: inputNewTask.value,
            id: createId(),
            list: condition()
        }
        addTask(task);
    }
});

/* Manipulação de evento para quando o botão btnAddTask for clicado,
criar um novo task e adicionar um item à lista*/
btnAddTask.addEventListener('click', (e) => {
 
    let task = {
        name: inputNewTask.value,
        id: createId(),
        list: condition()
    }
    addTask(task);
});


// Função para gerar ID com valor aleatório arredondado de no max 3000
function createId() {
    return Math.floor(Math.random() * 3000);
}

function condition() {
    let selectedOption = listSelection.value;
    return selectedOption;
  }

// Função para adicionar uma nova tarefa na TODO List
function addTask(task) {

    if (inputNewTask.value == '') {
        alert('Adicione uma tarefa');
    } else {
        dbTasks.push(task);
        saveTasksLocalStorage(dbTasks);
        renderTaskListHtml();
    }
}

// Função que cria elementos HTML e retorna um item
function createTagLi(task) {

    let li = document.createElement('li');
    li.id = task.id;

    let span = document.createElement('span');
    span.classList.add('taskText');
    span.innerHTML = task.name;

    let div = document.createElement('div');

    let btnDelete = document.createElement('button');
    btnDelete.classList.add('btnAction');
    btnDelete.innerHTML = '<i class="fa fa-trash"></i>';
    btnDelete.setAttribute('onclick', 'deleting('+task.id+')');

    div.appendChild(btnDelete);

    li.appendChild(span);
    li.appendChild(div);
    return li;
}

// Função para deletar item da TODO List
function deleting(taskId) {
    let confirmation = window.confirm('Tem certeza que deseja excluir? ');
    if (confirmation) {

        const taskIndex = obtainTaskIndexById(taskId);
        dbTasks.splice(taskIndex, 1);
        saveTasksLocalStorage();

        let li = document.getElementById(taskId);
        if(li) {
            li.parentNode.removeChild(li);
        } else {
            alert("Elemento HTML não encontrado");
        }
    }
}

/* Função que recolhe a posição da taskId no índice e 
retorna a informação */
function obtainTaskIndexById(taskId) {
    const taskIndex = dbTasks.findIndex(t => t.id == taskId);
    if(taskIndex < 0) {
        throw new Error('Id da tarefa não encontrado: ', taskId);
    }
    return taskIndex;
}

// Função que 
function renderTaskListHtml() {

    const dayList = document.querySelector('#dayTaskList');
    const nightList = document.querySelector('#nightTaskList');

    const selectedOption = condition();

    dayList.innerHTML = '';
    nightList.innerHTML = '';

    const dayTasks = dbTasks.filter(task => task.list === 'day');
    const nightTasks = dbTasks.filter(task => task.list === 'night');

    renderTasks(dayTasks, dayList);
    renderTasks(nightTasks, nightList);

    inputNewTask.value = '';  
}

function renderTasks(tasks, list) {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!document.getElementById(task.id)) { // Verifica se o item já está presente na lista
            const li = createTagLi(task);
            list.appendChild(li);
        }
    }
}

// Função que salva as tarefas atuais no localStorage
function saveTasksLocalStorage() {
    localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(dbTasks));
}

// Função que recebe as tarefas que constam salvas no localStorage
function obtainTasksLocalStorage() {
    if(localStorage.getItem(KEY_LOCAL_STORAGE)) {
        dbTasks = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE));
    }  
}