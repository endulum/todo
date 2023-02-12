import Masonry from "masonry-layout";
import { Task, Todo, Project } from "../logic/core";
import { hobbies, familiars } from "../logic/dummy";
import { $, create, Base } from "./base.js";

// display manages the ui
const Display = ((projectView, todoView) => {

    const emptyProjectView = () => projectView.innerHTML = '';
    const emptyTodoView = () => todoView.innerHTML = '';

    const generateProjectCard = project => {

        const projectCard = create('div', projectView, 'class', 'project', null);
        const title = create('h2', projectCard, null, null, project.title);
        const totalTodos = create('small', projectCard, null, null, `${project.total} todos`);
        const totalTasks = create('small', projectCard, null, null, `${project.totalTasksComplete} out of ${project.totalTasks} total items complete`);

        return title;
    }

    const generateTodoCard = (todo, viewType) => {
        const card = create('div', todoView, 'class', 'todo', null);
        const title = create('h2', card, null, null, null);
        const titleText = create('span', title, null, null, todo.title);
        const priority = create('div', title, 'class', todo.priority, null);

        const due = create ('p', card, null, null, todo.due);
        if (todo.due != 'No due date') {
            due.appendChild(document.createElement('br'));
            const distance = create('small', due, null, null, todo.distance);
        }

        const description = create('p', card, null, null, todo.description);

        if (viewType == 'mini') {
            card.classList.add('card');
            description.appendChild(document.createElement('br'));
            const totals = create('small', description, null, null, `${todo.totalComplete} out of ${todo.total} items complete`);
            return title;
        } else if (viewType == 'expand') {
            card.classList.add('expand');
            generateTaskList(todo, card);

            // this is sooooo not solid-compliant
            const titleEdit = create('button', title, null, null, 'Edit Title');
            titleEdit.addEventListener('click', () => {
                const titleEditField = create('input', null, null, null, null);
                const titleEditSubmit = create('button', null, null, null, 'Submit');
                title.replaceChild(titleEditSubmit, titleEdit);
                title.replaceChild(titleEditField, titleText);

                titleEditSubmit.addEventListener('click', () => {
                    App.changeTodoTitle(todo, titleEditField.value);
                });
            });
        }
    }

    const generateTaskList = (todo, cardNode) => {
        const tasks = create('ul', cardNode, 'class', 'tasklist', null);
        for (let t of todo.tasks) {
            let task = create('li', tasks, 'class', 'task', null);
            let check = create('input', task, null, null, null);
            check.setAttribute('type', 'checkbox');
            let description = create('div', task, null, null, t.description);
            if (t.done) check.checked = true;
        }
    }

    const editText = () => {
        console.warn('text was edited!!!!!');
    }

    return {
        emptyProjectView, 
        emptyTodoView, 
        generateProjectCard,
        generateTodoCard
    };

})(Base.projectView, Base.todoView);

// app manages interaction between the display and the data
export const App = (() => {
    // DUMMY CONTENT, remove later
    const projects = [hobbies, familiars];

    let projectInFocus = '';
    let todoInFocus = '';

    const refreshProjectView = () => {
        Display.emptyProjectView();
        for (let p of projects) {
            let title = Display.generateProjectCard(p);
            title.addEventListener('click', refreshTodoView.bind(App, p));
        }
    }

    const refreshTodoView = project => {
        if (projectInFocus == project.title) {
            return;
        } else {
            projectInFocus = project.title;
            Display.emptyTodoView();
            for (let t of project.todos) {
                let title = Display.generateTodoCard(t, 'mini');
                title.addEventListener('click', expandTodo.bind(App, t));
            }
        }
    }

    const expandTodo = todo => {
        Display.emptyTodoView();
        Display.generateTodoCard(todo, 'expand');
        projectInFocus = '';
        todoInFocus = todo.title;
    }

    const changeTodoTitle = (todo, newTitle) => {
        todo.title = newTitle;
        expandTodo(todo);
        console.log(todo.print());
    }

    // const expandView = (todo) => {
    //     // quick empty
    //     Foundation.todoView.innerHTML = '';

    //     currentTodoViewing = todo.title;
    //     renderTodo(todo, 'expand');
    // }

    // const markTask = task => {
    //     task.toggle();
    //     refreshProjectView();
    // }

    // const renderTodo = (todo, viewType) => {
    //     // create top-level elements
    //     const card = create('div', Foundation.todoView, 'class', 'todo', null);
    //     const title = create('h2', card, null, null, todo.title);
    //     const priority = create('div', title, 'class', todo.priority, null);
    //     const due = create ('p', card, null, null, todo.due);
    //     if (todo.due != 'No due date') {
    //         due.appendChild(document.createElement('br'));
    //         const distance = create('small', due, null, null, todo.distance);
    //     }
    //     const description = create('p', card, null, null, todo.description);
    //     const tasks = create('ul', card, 'class', 'tasklist', null);

    //     // create tasklist
    //     for (let t of todo.tasks) {
    //         createTaskCheck(t, tasks, viewType, todo, todo.tasks.indexOf(t));
    //     }

    //     switch (viewType) {
    //         case 'card': 
    //             card.classList.add('card');
    //             return title;
    //         case 'expand':
    //             console.log('an input is added...');
    //             card.classList.add('expanded');
    //             let addTaskInput = create('input', card, null, null, null);
    //             addTaskInput.setAttribute('type', 'text');
    //             addTaskInput.setAttribute('placeholder', 'Add new task here...');
    //             addTaskInput.required = true;
    //             let submitTaskInput = create('button', card, null, null, "Submit");
    //             submitTaskInput.addEventListener('click', () => {
    //                 let newTask = Task(addTaskInput.value);
    //                 todo.add(newTask);
    //                 console.log(todo.print());
    //                 createTaskCheck(newTask, tasks);
    //                 refreshProjectView();
    //             });
    //     }
    // }

    // const createTaskCheck = (t, taskList, viewType, todo, index) => {
    //     let task = create('li', taskList, 'class', 'task', null);
    //     let check = create('input', task, null, null, null);
    //     check.setAttribute('type', 'checkbox');
    //     let description = create('div', task, null, null, t.description);
    //     // fills in anything already done
    //     if (t.done) check.checked = true;
    //     // add listener - on click, mark the Task object as done
    //     check.addEventListener('click', markTask.bind(App, t));
    //     if (viewType == 'expand') {
    //         let removeTask = create('button', task, null, null, 'remove');
    //         removeTask.addEventListener('click', () => {
    //             todo.remove(index - 1);
    //             taskList.removeChild(task);
    //             refreshProjectView();
    //         });
    //     }
    // }

    // return { add, remove };
    return {
        refreshProjectView,
        changeTodoTitle
    };
})();