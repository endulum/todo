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
    // todo addition and removal
    const addTodo = () => {
        let newTodo = Todo('New Todo', 'none', undefined, 'Description')
        newTodo.add(Task('Task'));
        projectInFocus.add(newTodo);
        console.log(projectInFocus.print());
        refreshTodos(projectInFocus);
    }
    const removeTodo = index => {
        projectInFocus.remove(index);
        console.log(projectInFocus.print());
        refreshTodos(projectInFocus);
    }
    // project addition and removal
    const addProject = () => {
        let newProject = Project(`New Project`);
        projects.push(newProject);
        refreshProjects();
    }
    // priority edition
    const setPriority = (todo, p) => {
        todo.priority = p;
        refreshTodos(projectInFocus);
        console.log(todo.print());
    }
    return {
        projectInFocus,
        todoInFocus,
        refreshProjects,
        refreshTodos,
        changeTodoDetail,
        toggleTask,
        removeTask,
        addTask,
        addTodo,
        removeTodo,
        addProject,
        setPriority
    }
})();

const GUI = ((projectView, todoView) => {
    // empty the project panel or todo panel as needed
    const emptyProjectView = () => projectView.innerHTML = '';
    const emptyTodoView = () => todoView.innerHTML = '';
    // regenerate project view as needed
    const regenerateProjectView = projects => {
        emptyProjectView();
        if (projects.length > 0) {
            for (let project of projects) makeProjectLink(project);
        }
        const addProject = create('button', projectView, 'Add a Project');
        addProject.addEventListener('click', Management.addProject);
    }
    // regenerate todo overview as needed
    const regenerateTodoView = (project) => {
        emptyTodoView();
        makeProjectHeader(project);
        for (let t of project.todos) {
            makeTodoCard(t, project.todos.indexOf(t));
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
        let nodes = Array.from(projectView.childNodes)
        for (let node of nodes) {
            if (nodes.indexOf(node) == projects.indexOf(projectInFocus)) {
                node.classList.add('active');
            }
        }
    }
    // make header with controls, above the todo listing
    const makeProjectHeader = project => {
        create('h1', todoView, project.title);
        let addTodo = create('button', todoView, 'Add a Todo');
        addTodo.addEventListener('click', Management.addTodo);
    }
    // make individual todo cards
    const makeTodoCard = (todo, index) => {
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
        const deleteTodo = create('button', card, 'Delete Todo');
        deleteTodo.addEventListener('click', Management.removeTodo.bind(Management, index));
        const setPriority = create('div', card, null);
        const priority = create('div', setPriority, null);
        priority.classList.add('priority');
        priority.addEventListener('click', () => {
            priority.innerHTML = '';
            for (let p = 0; p < 4; p++) {
                const btn = create('div', priority, null);
                let className;
                switch (p) {
                    case 0: className = 'none'; break;
                    case 1: className = 'low'; break;
                    case 2: className = 'medium'; break;
                    case 3: className = 'high'; break;
                }
                btn.classList.add(className);
                btn.addEventListener('click', Management.setPriority.bind(Management, todo, p));
            }
        });
    }
    // add edit pencils to each aspect of the todo
    const makeEditable = (cardNode, className, todoDetail) => {
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