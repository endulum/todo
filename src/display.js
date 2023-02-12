import Masonry from "masonry-layout";
import { Task, Todo, Project } from "./logic/core";

// functions for ease of DOM manip

const $ = selector => document.querySelector(selector);

const create = (elementType, parentNode, selectorType, selectorName, textContent) => {
    // make the element
    let element = document.createElement(elementType);
    // give it a class OR id
    switch (selectorType) {
        case 'id': element.id = selectorName; break;
        case 'class': element.className = selectorName; break;
    }
    // put text inside the element
    element.textContent = textContent;
    // append element to a parent
    parentNode.appendChild(element);

    return element;
}

// loads up the basic body

export const Foundation = (db => {
    console.warn('Invoking Foundation');
    // body
    const sidebar = create('aside', db, undefined, undefined, undefined);
    const content = create('main', db, undefined, undefined, undefined);
    // places where content will be generated
    const projectView = create('div', sidebar, 'id', 'projects', undefined);
    const todoView = create('div', content, 'id', 'todos', undefined);

    return { projectView, todoView };
})(document.body);

// fills body with whatever Todo information exists
export const App = (() => {
    console.warn('Invoking App');

    const projects = [];

    let currentProjectViewing = '';
    let currentTodoViewing = 'startup';

    const add = function(project) {
        projects.push(project);
        refreshProjectView();
    }

    const remove = function(index) {
        projects.splice(index - 1, 1);
    }

    const refreshProjectView = () => {
        // quick empty
        Foundation.projectView.innerHTML = '';
        for (let p of projects) {
            // create elements
            const project = create('div', Foundation.projectView, 'class', 'project', undefined);
            const title = create('h2', project, undefined, undefined, p.title);
            const totalTodos = create('small', project, undefined, undefined, `${p.total} todos`);
            const totalTasks = create('small', project, undefined, undefined, `${p.totalTasksComplete} out of ${p.totalTasks} tasks complete`);
            // add listener - on click, open the project in #todos
            project.addEventListener('click', refreshTodoView.bind(App, p));
        }
    }

    const refreshTodoView = project => {
        if (App.currentProjectViewing != project.title || currentTodoViewing != '') {
            App.currentProjectViewing = project.title;
            cardView(project);
        }
    }

    const cardView = project => {
        // quick empty
        Foundation.todoView.innerHTML = '';

        // add sizer to make Masonry work
        let sizer = create('div', Foundation.todoView, 'class', 'card-sizer', undefined);

        // add listener - on click, expand the card
        for (let todo of project.todos) {
            renderTodo(todo, 'card').addEventListener('click', expandView.bind(App, todo));
        }

        // Masonry magic
        invokeMasonry();
    }

    const invokeMasonry = () => {
        console.log('Masonry time.');
        let msnry = new Masonry( $('#todos'), {
            itemSelector: '.card',
            columnWidth: '.card-sizer',
            gutter: 15,
            percentPosition: true,
        })
    }

    const expandView = (todo) => {
        // quick empty
        Foundation.todoView.innerHTML = '';

        currentTodoViewing = todo.title;
        renderTodo(todo, 'expand');
    }

    const markTask = task => {
        task.toggle();
        refreshProjectView();
    }

    const renderTodo = (todo, viewType) => {
        // create top-level elements
        const card = create('div', Foundation.todoView, 'class', 'todo', undefined);
        const title = create('h2', card, undefined, undefined, todo.title);
        const priority = create('div', title, 'class', todo.priority, undefined);
        const due = create ('p', card, undefined, undefined, todo.due);
        if (todo.due != 'No due date') {
            due.appendChild(document.createElement('br'));
            const distance = create('small', due, undefined, undefined, todo.distance);
        }
        const description = create('p', card, undefined, undefined, todo.description);
        const tasks = create('ul', card, 'class', 'tasklist', undefined);

        // create tasklist
        for (let t of todo.tasks) {
            createTaskCheck(t, tasks);
        }

        switch (viewType) {
            case 'card': 
                card.classList.add('card');
                return title;
            case 'expand':
                console.log('an input is added...');
                card.classList.add('expanded');
                let addTaskInput = create('input', card, undefined, undefined, undefined);
                addTaskInput.setAttribute('type', 'text');
                addTaskInput.setAttribute('placeholder', 'Add new task here...');
                addTaskInput.required = true;
                let submitTaskInput = create('button', card, undefined, undefined, "Submit");
                submitTaskInput.addEventListener('click', () => {
                    let newTask = Task(addTaskInput.value);
                    todo.add(newTask);
                    createTaskCheck(newTask, tasks);
                    refreshProjectView();
                });
        }
    }

    const createTaskCheck = (t, taskList) => {
        let task = create('li', taskList, 'class', 'task', undefined);
        let check = create('input', task, undefined, undefined, undefined);
        check.setAttribute('type', 'checkbox');
        let description = create('div', task, undefined, undefined, t.description);
        // fills in anything already done
        if (t.done) check.checked = true;
        // add listener - on click, mark the Task object as done
        check.addEventListener('click', markTask.bind(App, t));
    }

    return { add, remove };
})();