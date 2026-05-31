const todo = []
let filter = 'all';
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const currentDay = document.getElementById('current-date');
const prevDay = document.getElementById('prev-date');
const nextDay = document.getElementById('next-date');

let selectedDate = new Date();

loadTodos();
renderDate();
renderTodoList();

//날짜
function renderDate() {
  currentDay.value = toDateKey(selectedDate); // value!
}

nextDay.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() + 1);
  renderDate();
  renderTodoList();
});

prevDay.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() - 1);
  renderDate();
  renderTodoList();
});

currentDay.addEventListener('change', () => {
  selectedDate = new Date(currentDay.value); 
  renderTodoList();
});


// 왜 영어는 주황색으로 뜨지 todo 코드
filterButtons[0].classList.add('active');
todoInput.addEventListener('keypress', function (e) { if (e.key === 'Enter') {
        const todoText = e.target.value.trim();
        if (todoText) {
          addTodoItem(todoText);
          e.target.value = '';
        }
        else {
          toastNotification('할 일을 입력해주세요.');
        }
    }
});

function toastNotification(message) {
    if (document.querySelector('.toast')) return; // 이미 토스트가 있으면 무시
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 1000);
}
function toDateKey(date) {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
}

function addTodoItem(text) {
    const todoItem = {
        id: Date.now(),
        text: text,
        completed: false,
        date: toDateKey(selectedDate)
    };
    todo.push(todoItem);
    saveTodos();
    console.log(todo);
    renderTodoList();
}
  
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;

    filterButtons.forEach((r) => r.classList.remove('active')); // 전부 제거
    btn.classList.add('active');                                // 누른 것만 추가

    renderTodoList();
  });
});

function renderTodoList() {
  todoList.innerHTML = '';
  const filtered = todo.filter(todo => {
    if (filter !== 'every' && todo.date !== toDateKey(selectedDate)) {
      return false;
    } 
    if (filter === 'all') return true;
    if (filter === 'progress') return !todo.completed;
    if (filter === 'complete') return todo.completed;
    if (filter === 'every') return true;
  }); 
  
  if (filtered.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.textContent = '텅...';
    emptyMsg.className = 'empty-msg';
    todoList.appendChild(emptyMsg);
    return;
  }
  filtered.forEach(todo => {
    const li = document.createElement('li');
    const textSpan = document.createElement('span');

    textSpan.textContent = todo.text;
    if (filter === 'every') {
      textSpan.textContent = `[${todo.date}] ${todo.text}`;
    }
    if (todo.completed) {
      textSpan.classList.add('done');  // 완료면 done 클래스
    }
    li.appendChild(textSpan);
    li.className = 'todo-item';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => {
      deleteTodo(todo.id);
    });
    
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = '완료';
    completeBtn.addEventListener('click', () => {
      toggleComplete(todo.id);
    });
    

    li.appendChild(deleteBtn);
    li.appendChild(completeBtn);
    todoList.appendChild(li);
  });
}

function deleteTodo(id) {
  const index = todo.findIndex((t) => t.id === id);
  todo.splice(index, 1);
  saveTodos();
  renderTodoList();
}

function toggleComplete(id) {
  const target = todo.find((t) => t.id === id);
  target.completed = !target.completed;
  saveTodos();
  renderTodoList();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todo));
}

function loadTodos() {
  const saved = JSON.parse(localStorage.getItem('todos')) || [];
  todo.push(...saved);
}