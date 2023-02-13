
import { Task, Todo, Project } from "../logic/core";
import { hobbies, familiars } from "../logic/dummy";
import { $, create, Base } from "./base.js";

// display manages the ui
const Display = ((projectView, todoView) => {

    const emptyProjectView = () => projectView.innerHTML = '';
    const emptyTodoView = () => todoView.innerHTML = '';

    const generateProjectCard = project => {

        const projectCard = create('div', projectView, null);
        projectCard.classList.add('project');

        const title = create('h2', projectCard, project.title);
        const totalTodos = create('small', projectCard, `${project.total} todos`);
        const totalTasks = create('small', projectCard,`${project.totalTasksComplete} out of ${project.totalTasks} total items complete`);

        return title;
    }

    const generateTodoCard = (todo, viewType) => {

        const card = create('div', todoView, null);
        card.classList.add('todo');

        const title = create('h2', card, null);
        const titleText = create('span', title, todo.title);

        const priority = create('div', title, null);
        priority.classList.add(todo.priority);

        const due = create('p', card, null);
        const dueText = create('span', due, todo.due);
        if (todo.due != 'No due date') {
            due.appendChild(document.createElement('br'));
            const distance = create('small', due, todo.distance);
        }

        const description = create('p', card, null);
        const descriptionText = create('span', description, todo.description)

        if (viewType == 'mini') {

            card.classList.add('card');
            description.appendChild(document.createElement('br'));
            const totals = create('small', description, `${todo.totalComplete} out of ${todo.total} items complete`);

            return title;

        } else if (viewType == 'expand') {

            card.classList.add('expand');
            generateTaskList(todo, card);

            // this is sooooo not solid-compliant
            const titleEdit = create('button', title, 'Edit Title');
            titleEdit.addEventListener('click', generateEditButtons.bind(Display, todo, 'title', title, titleText, titleEdit));

            const dueEdit = create('button', null, 'Edit Due Date');
            dueText.parentNode.insertBefore(dueEdit, dueText.nextSibling);
            dueEdit.addEventListener('click', generateEditButtons.bind(Display, todo, 'date', due, dueText, dueEdit));

            const descEdit = create('button', null, 'Edit Description');
            description.appendChild(document.createElement('br'));
            description.appendChild(descEdit);
            descEdit.addEventListener('click', generateEditButtons.bind(Display, todo, 'desc', description, descriptionText, descEdit));

        }
    }

    const generateEditButtons = (todo, detailType, parentNode, textToEdit, editButton) => {

        let defaultValue;
        let editField;
        
        if (detailType == 'desc') {
            editField = create('textarea', null, null);
        } else {
            editField = create('input', null, null);
        }
        const editSubmit = create('button', null, 'Submit');

        parentNode.replaceChild(editSubmit, editButton);
        parentNode.replaceChild(editField, textToEdit);

        switch (detailType) {
            case 'title':
                defaultValue = todo.title;
                editField.setAttribute('type', 'text');
                editField.setAttribute('placeholder', todo.title);
                break;
            case 'date':
                defaultValue = 0;
                editField.setAttribute('type', 'date');
                break;
            case 'desc':
                defaultValue = todo.description;
                editField.setAttribute('placeholder', todo.title);
        }

        editSubmit.addEventListener('click', () => {
            if (editField.value == '') {
                App.changeTodoDetail(todo, detailType, defaultValue);
            } else {
                switch (detailType) {
                    case 'title':
                        App.changeTodoDetail(todo, 'title', editField.value.toString());
                        break;
                    case 'date':
                        App.changeTodoDetail(todo, 'date', editField.valueAsDate);
                        break;
                    case 'desc':
                        App.changeTodoDetail(todo, 'desc', editField.value.toString());
                        break;
                }
            }
        });
    }

    const generateTaskList = (todo, cardNode) => {

        const tasks = create('ul', cardNode, null);
        tasks.classList.add('tasklist');

        for (let t of todo.tasks) {
            generateTask(tasks, todo, t);
        }

        let addInput = create('input', cardNode, null);
        addInput.setAttribute('type', 'text');
        addInput.setAttribute('placeholder', 'Add new item...');
        let addSubmit = create('button', cardNode, 'Submit');

        addSubmit.addEventListener('click', () => {
            let newTask = App.addTask(todo, Task(addInput.value.toString()));
            generateTask(tasks, todo, newTask);
            console.log(todo.print());
            App.refreshProjectView();
        });
    }

    const generateTask = (taskList, todo, t) => {
        
        let task = create('li', taskList, null);
        task.classList.add('task');
        
        let check = create('input', task, null);
        check.setAttribute('type', 'checkbox');
        if (t.done) check.checked = true;
        check.addEventListener('click', () => {
            App.toggleTask(t);
            App.refreshProjectView();
        });

        let description = create('div', task, t.description);

        let remove = create('button', task, 'Remove');
        remove.addEventListener('click', () => {
            App.removeTask(todo, todo.tasks.indexOf(t));
            App.refreshProjectView();
            taskList.removeChild(task);
        });
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

    const changeTodoDetail = (todo, detailType, newDetail) => {
        switch (detailType) {
            case 'title': todo.title = newDetail; break;
            case 'date': todo.due = newDetail; break;
            case 'desc': todo.description = newDetail; break;
        }
        expandTodo(todo);
        console.log(todo.print());
    }

    const toggleTask = (task) => {
        task.toggle();
    }

    const removeTask = (todo, index) => {
        todo.remove(index + 1);
    }

    const addTask = (todo, task) => {
        todo.add(task);
        return task;
    }

    return {
        refreshProjectView,
        changeTodoDetail,
        toggleTask,
        removeTask,
        addTask
    };
})();