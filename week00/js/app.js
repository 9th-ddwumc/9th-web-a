// 간단한 상태 + 로컬스토리지 (새로고침에도 유지)
const STORE_KEY = 'umc-todo-v1';
let state = JSON.parse(localStorage.getItem(STORE_KEY) || '{"todo":[],"done":[]}');

const $todoList = document.getElementById('todo-list');
const $doneList = document.getElementById('done-list');
const $form = document.getElementById('add-form');
const $input = document.getElementById('todo-input');

function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

$form.addEventListener('submit', e => {
  e.preventDefault();
  const text = $input.value.trim();
  if(!text) return;
  state.todo.push(text);
  $input.value = '';
  save(); render();
});

function render(){
  renderList($todoList, state.todo, 'todo');
  renderList($doneList, state.done, 'done');
}

function renderList(ul, items, type){
  ul.innerHTML = '';
  if(items.length === 0){
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = type === 'todo' ? '할 일을 추가해 보세요.' : '완료한 일이 여기에 표시됩니다.';
    ul.appendChild(li);
    return;
  }
  items.forEach((text, idx) => {
    const li = document.createElement('li');
    li.dataset.type = type;
    li.dataset.index = idx;

    const title = document.createElement('span');
    title.className = 'item-title' + (type === 'done' ? ' done-text' : '');
    title.textContent = text;

    const actions = document.createElement('div');
    actions.className = 'actions';
    if(type === 'todo'){
      actions.innerHTML = `
        <button class="btn complete" data-action="complete">완료</button>
        <button class="btn delete" data-action="delete">삭제</button>`;
    }else{
      actions.innerHTML = `
        <button class="btn undo" data-action="undo">되돌리기</button>
        <button class="btn delete" data-action="delete">삭제</button>`;
    }

    li.append(title, actions);
    ul.appendChild(li);
  });
}

// 이벤트 위임: 버튼 동작(완료/되돌리기/삭제)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;

  const li = btn.closest('li');
  const type = li.dataset.type;
  const index = Number(li.dataset.index);
  const action = btn.dataset.action;

  if(action === 'complete'){
    const [t] = state.todo.splice(index, 1);
    state.done.unshift(t);
  }else if(action === 'undo'){
    const [t] = state.done.splice(index, 1);
    state.todo.unshift(t);
  }else if(action === 'delete'){
    state[type].splice(index, 1);
  }
  save(); render();
});

// 초기 렌더
render();
