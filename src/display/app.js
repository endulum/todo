import { Task, Todo, Project } from "../logic/core";
import { hobbies, familiars } from "../logic/dummy";
import { $, create, Base } from "./base.js";

// hiii welcome to refactor hell <3

export const Management = (() => {
    // grab dummy info
    const projects = [hobbies, familiars];
    // track what content is on focus
    let projectInFocus = '';
    let todoInFocus = '';
    // refresh the projects panel
    const refreshProjects = () => {
        GUI.regenerateProjectView(projects);
    }
    // refresh the todo overview
    const refreshTodos = (project) => {
        if (projectInFocus != project) {
            projectInFocus = project;
        }
        GUI.setActiveProject(projects, projectInFocus);
        GUI.regenerateTodoView(project);
    }
    // change something about a given todo
    const changeTodoDetail = (todo, detailType, newDetail) => {
        switch (detailType) {
            case 'title': todo.title = newDetail; break;
            case 'date': todo.due = newDetail; break;
            case 'desc': todo.description = newDetail; break;
        }
        refreshTodos(projectInFocus);
    }
    // task editing
    const toggleTask = (task) => {
        task.toggle();
        GUI.updateProjectStats(projectInFocus);
    }
    const removeTask = (todo, index) => {
        todo.remove(index + 1);
        GUI.updateProjectStats(projectInFocus);
    }
    const addTask = (todo, task) => {
        todo.add(task);
        GUI.updateProjectStats(projectInFocus);
        return task;
    }

    return {
        projectInFocus,
        refreshProjects,
        refreshTodos,
        changeTodoDetail,
        toggleTask,
        removeTask,
        addTask
    }
})();

const GUI = ((projectView, todoView) => {
    // empty the project panel or todo panel as needed
    const emptyProjectView = () => projectView.innerHTML = '';
    const emptyTodoView = () => todoView.innerHTML = '';
    // regenerate project view as needed
    const regenerateProjectView = projects => {
        emptyProjectView();
        for (let project of projects) makeProjectLink(project);
    }
    // regenerate todo overview as needed
    const regenerateTodoView = (project, viewType) => {
        emptyTodoView();
        makeProjectHeader(project);
        for (let t of project.todos) {
            makeTodoCard(t);
        }
    }
    // make each individual project link
    const makeProjectLink = project => {
        const projectLink = create('div', projectView, null);
        projectLink.classList.add('project');
        const projectLinkTitle = create('h3', projectLink, project.title);
        const projectDetails = create('div', projectLink, null);
        const projectTotalTodos = create('small', projectDetails, 
            `${project.todos.length} todos`);
        const projectTaskCounter = create('small', projectDetails, 
            `${project.totalTasksComplete} out of ${project.totalTasks} total items complete`);
        // on click, set the project as focused and open the project's contents
        projectLink.addEventListener('click', () => {
            Management.refreshTodos(project);
        });
    }
    // live changes to the actively viewed project card
    const updateProjectStats = (p) => {
        let node = $('.project.active');
        node.querySelector('h3').textContent = p.title;
        node.querySelector('small:first-child').textContent = `${p.todos.length} todos`;
        node.querySelector('small:last-child').textContent = `${p.totalTasksComplete} out of ${p.totalTasks} total items complete`;
    }
    // change styling for the project currently being viewed
    const setActiveProject = (projects, projectInFocus) => {
        regenerateProjectView(projects);
        for (let projectNode of projectView.childNodes) {
            if (projectNode.firstChild.textContent == projectInFocus.title) {
                projectNode.classList.add('active');
            }
        }
    }
    const makeProjectHeader = project => {
        create('h1', todoView, project.title);
    }
    // make individual todo cards
    const makeTodoCard = todo => {
        const card = create('div', todoView, null);
        card.classList.add('todo');
        // make edit buttons for each aspect of the todo
        const title = makeEditable(card, 'todo-title', todo.title, 'title');
        title.addEventListener('click', performEdit.bind(GUI, title.parentNode, 'title', todo));
        const due = makeEditable(card, 'todo-due', todo.due, 'due');
        due.addEventListener('click', performEdit.bind(GUI, due.parentNode, 'due', todo));
        const desc = makeEditable(card, 'todo-description', todo.description, 'desc');
        desc.addEventListener('click', performEdit.bind(GUI, desc.parentNode, 'desc', todo));
        generateTaskList(todo, card);
    }
    // add edit pencils to each aspect of the todo
    const makeEditable = (cardNode, className, todoDetail, detailType) => {
        const editable = create('div', cardNode, null);
        editable.classList.add(className);
        const text = create('span', editable, todoDetail);
        const edit = create('button', editable, 'Edit');
        edit.classList.add('btn');
        return edit;
    }
    // functionality for editing todos on the fly
    const performEdit = (parentNode, detailType, todo) => {
        let text = parentNode.querySelector('span');
        let edit = parentNode.querySelector('button');
        let editField;
        if (detailType == 'desc') {
            editField = create('textarea', null, null);
        } else {
            editField = create('input', null, null);
        }
        const editSubmit = create('button', null, 'Submit');
        parentNode.replaceChild(editSubmit, edit);
        parentNode.replaceChild(editField, text);
        let defaultValue;
        switch (detailType) {
            case 'title':
                defaultValue = todo.title;
                editField.setAttribute('type', 'text');
                editField.setAttribute('placeholder', todo.title); break;
            case 'due':
                defaultValue = 0;
                editField.setAttribute('type', 'date'); break;
            case 'desc':
                defaultValue = todo.description;
                editField.setAttribute('placeholder', todo.description); break;
        }
        editSubmit.addEventListener('click', () => {
            if (editField.value == '') {
                Management.changeTodoDetail(todo, detailType, defaultValue);
            } else {
                switch (detailType) {
                    case 'title':
                        Management.changeTodoDetail(todo, 'title', editField.value.toString()); break;
                    case 'due':
                        Management.changeTodoDetail(todo, 'date', editField.valueAsDate); break;
                    case 'desc':
                        Management.changeTodoDetail(todo, 'desc', editField.value.toString()); break;
                }
            }
        });
    }
    // renders a list of tasks for each todo
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
            let newTask = Management.addTask(todo, Task(addInput.value.toString()));
            generateTask(tasks, todo, newTask);
        });
    }
    // renders individual tasks
    const generateTask = (taskList, todo, t) => {
        let task = create('li', taskList, null);
        task.classList.add('task');
        let check = create('input', task, null);
        check.setAttribute('type', 'checkbox');
        if (t.done) check.checked = true;
        check.addEventListener('click', () => {
            Management.toggleTask(t);
        });
        let description = create('div', task, t.description);
        let remove = create('button', task, 'Remove');
        remove.addEventListener('click', () => {
            Management.removeTask(todo, todo.tasks.indexOf(t));
            taskList.removeChild(task);
        });
    }

    return {
        regenerateProjectView,
        regenerateTodoView,
        setActiveProject, 
        updateProjectStats
    }
})(Base.projectView, Base.todoView)