import Masonry from "masonry-layout";

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

    const currentProjectViewing = '';
    const currentTodoViewing = '';

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
        if (App.currentProjectViewing != project.title) {
            App.currentProjectViewing = project.title;
            makeCardsFor(project);
        }
    }

    const makeCardsFor = project => {
        // quick empty
        Foundation.todoView.innerHTML = '';
        // add sizer to make Masonry work
        let sizer = create('div', Foundation.todoView, 'class', 'card-sizer', undefined);

        for (let todo of project.todos) {
            // create top-level elements
            const card = create('div', Foundation.todoView, 'class', 'todo', undefined);
            card.classList.add('card')
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
                let task = create('li', tasks, 'class', 'task', undefined);
                let check = create('input', task, undefined, undefined, undefined);
                check.setAttribute('type', 'checkbox');
                let description = create('div', task, undefined, undefined, t.description);
                // fills in anything already done
                if (t.done) check.checked = true;
                // add listener - on click, mark the Task object as done
                check.addEventListener('click', markTask.bind(App, t));
            }
        }

        // Masonry magic
        invokeMasonry();


        // if (Foundation.todoView.className != 'grid') {
        //     Foundation.todoView.className = 'grid';
        //     gridView();
        // }
    }

    const markTask = task => {
        task.toggle();
        refreshProjectView();
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

    // const gridView = () => {
    //     let grid = document.querySelector('#todos');
    //     let msnry;
    //     msnry = new Masonry( grid, {
    //         itemSelector: '.todo',
    //         columnWidth: '.todo',
    //         percentPosition: true
    //     });
    // }

    return { add, remove };
})();