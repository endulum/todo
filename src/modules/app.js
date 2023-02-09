import { $, create } from "./basic";



export const App = (() => {
    console.warn('Immediately invoking App. This should only happen once.');

    const projects = [];

    let currentProjectViewing = '';

    const add = function(project) {
        projects.push(project);
        populateSidebar();
    }

    const remove = function(index) {
        projects.splice(index - 1, 1);
    }

    const populateSidebar = function() {
        $('#projects').innerHTML = '';
        for (let p of projects) {
            let project = create('div', undefined, undefined, $('#projects'));
            let title = create('p', undefined, p.title, project);
            let totalTodos = create('small', 'todo-count', `${p.total} todos`, project);
            let totalTasks = create('small', 'total-tasks', `${p.totalTasksComplete} out of ${p.totalTasks} tasks complete`, project);
            project.addEventListener('click', viewProject.bind(App, p));
        }
    }

    const viewProject = function(project) {
        if (App.currentProjectViewing != project.title) {
            App.currentProjectViewing = project.title;
            makeCardsFor(project);
        }
    }

    return {add, remove, populateSidebar}
})();

const makeCardsFor = (project) => {

    $('#content').innerHTML = '';

    for (let todo of project.todos) {
        let card = create('div', 'card', undefined, $('#content'));
        card.classList.add('mini');

        let priority = create('div', 'priority', `${todo.priority}`, card);
        priority.classList.add(todo.priority);

        let title = create('h3', undefined, todo.title, card);

        let due = create('p', 'due', todo.due, card);
        if (todo.due != 'no due date') {
            due.appendChild(document.createElement('br'));
            let distance = create('small', undefined, todo.distance, due)
        };

        let description = create('p', 'description', todo.description, card);

        let tasks = create('ul', 'tasks', undefined, card);
        for (let t of todo.tasks) {
            let task = create('li', undefined, undefined, tasks);
            let check = create('input', undefined, undefined, task);
            check.setAttribute('type', 'checkbox');
            if (t.done) check.checked = true;
            check.addEventListener('click', ()=> {
                t.toggle();
                App.populateSidebar();
            });
            let desc = create('label', undefined, t.description, task);
        }
    }
}