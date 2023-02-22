import { Base, create, $ } from "./base";
import { hobbies, familiars } from "../logic/dummy";
import { Task, Todo, Project } from "../logic/core";

export const CONTROL = (() => {

    let projects = [];

    const refreshStorage = () => {
        console.log('Focusing on ' + projectInFocus.title);
        let preserve = JSON.stringify(projects);
        localStorage.clear();
        localStorage.setItem('projects', preserve);
        console.log(localStorage);
        console.log('Focusing on ' + projectInFocus.title);
    }

    const initializeStorage = () => {
        // debugger;
        if (JSON.parse(localStorage.getItem('projects')) != null) {
            projects = JSON.parse(localStorage.getItem('projects'));
            console.log(projects);
        }
        renderProjects();
        console.log(localStorage);
    };

    const add = project => {
        projects.push(project);
    }

    // indicates the project in focus
    let projectInFocus = '';

    // indicates the todo in focus
    let todoInFocus = '';

    // indicates the task in focus
    let taskInFocus = '';

    // renders the project view
    const renderProjects = () => {
        refreshStorage();
        VIEW.renderProjects(projects);
        projectInFocus = '';
        VIEW.renderSplash();
    }

    // deletes the current project
    const deleteProject = () => {
        projects.splice(projects.indexOf(projectInFocus), 1);
        VIEW.emptyTodoView();
        renderProjects();
    }

    // adds a project
    const addProject = title => {
        const newProject = Project(title);
        projects.push(newProject);
        renderProjects();
        renderTodos(newProject);
    }

    // renders the todo overview of a selected project
    const renderTodos = project => {
        if (project != undefined) {
            projectInFocus = project;
        }
        todoInFocus = '';
        taskInFocus = '';
        VIEW.setActiveProject(projects, projectInFocus);
        VIEW.renderTodos(projectInFocus);
        refreshStorage();
    }

    // renders a todo in isolation
    const renderIsolatedTodo = todo => {
        if (todo != undefined) {
            todoInFocus = todo;
        }
        taskInFocus = '';
        VIEW.renderIsolatedTodo(todoInFocus, projectInFocus.todos.indexOf(todo));
        refreshStorage();
    }

    // helper to set a task in focus
    const setTaskInFocus = index => {
        taskInFocus = todoInFocus.tasks[index];
    }

    // addition, removal, and management of tasks
    const changeTaskDescription = desc => {
        taskInFocus.desc = desc;
        taskInFocus = '';
        renderIsolatedTodo(todoInFocus);
    }
    const addTask = desc => {
        todoInFocus.add(Task(desc));
        VIEW.updateProjectStats(projectInFocus);
        renderIsolatedTodo(todoInFocus);
    }
    const removeTask = index => {
        todoInFocus.remove(index);
        VIEW.updateProjectStats(projectInFocus);
        renderIsolatedTodo(todoInFocus);
    }
    const toggleTask = task => {
        task.toggle();
        VIEW.updateProjectStats(projectInFocus);
    }

    // addition, removal, and management of todos
    const changeTodoTitle = title => {
        todoInFocus.title = title;
        renderIsolatedTodo(todoInFocus);
    } 
    const changeTodoDue = due => {
        todoInFocus.due = due;
        renderIsolatedTodo(todoInFocus);
    }
    const changeTodoPriority = priority => {
        todoInFocus.priority = priority;
        renderIsolatedTodo(todoInFocus);
    }
    const changeTodoDescription = description => {
        todoInFocus.description = description;
        renderIsolatedTodo(todoInFocus);
    }
    const addTodo = () => {
        console.log('Focusing on ' + projectInFocus.title);
        let newTodo = Todo('New Todo', 'none', undefined, 'Add a description...');
        projectInFocus.add(newTodo);
        VIEW.updateProjectStats(projectInFocus);
        renderTodos(projectInFocus);
    }
    const removeTodo = index => {
        projectInFocus.remove(index);
        VIEW.updateProjectStats(projectInFocus);
        renderTodos(projectInFocus);
    }
    const getTodoIndex = todo => {
        return projectInFocus.todos.indexOf(todo);
    }

    return {
        // rendering and refreshing
        renderProjects, renderTodos, renderIsolatedTodo, setTaskInFocus,
        // task management
        changeTaskDescription, addTask, removeTask, toggleTask, 
        // todo management
        changeTodoTitle, changeTodoDue, changeTodoPriority, changeTodoDescription, addTodo, removeTodo, getTodoIndex,
        // project management
        renderProjects, deleteProject, addProject,
        // storage
        initializeStorage
    }
})();

export const VIEW = ((projectView, todoView) => {

    // indicates whether user is looking at card view or isolated view
    let mode = '';

    // empties project listing
    const emptyProjectView = () => {
        projectView.innerHTML = '';
    }

    // splash
    const renderSplash = () => {
        emptyTodoView();
        const splash = create('div', todoView, null);
        splash.className = 'splash';
        splash.innerHTML = `<h1>Taskly</h1><p>Bring your productivity back to life</p>`;
    }

    // rendering the projects

    const renderProjects = projects => {
        emptyProjectView();
        if (projects.length > 0) {
            for (let project of projects) makeProjectLink(project);
        }
        renderProjectAddPanel();
        // addProject.addEventListener('click', Management.addProject);
    }

    const renderProjectAddPanel = () => {
        const panel = create('div', projectView, null);
        panel.className = 'panel';
        const newProjectInput = create('input', panel, null);
        newProjectInput.setAttribute('placeholder', 'Title');
        create('button', panel, 'Add Project').addEventListener('click', () => {
            CONTROL.addProject(newProjectInput.value.toString());
        });
    }

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
            CONTROL.renderTodos(project);
        });
    }

    const updateProjectStats = p => {
        let node = $('.project.active');
        node.querySelector('h3').textContent = p.title;
        node.querySelector('small:first-child').textContent = `${p.todos.length} todos`;
        node.querySelector('small:last-child').textContent = `${p.totalTasksComplete} out of ${p.totalTasks} total items complete`;
    }

    const setActiveProject = (projects, projectInFocus) => {
        renderProjects(projects);
        let nodes = Array.from(projectView.childNodes)
        for (let node of nodes) {
            if (nodes.indexOf(node) == projects.indexOf(projectInFocus)) {
                node.classList.add('active');
            }
        }
    }

    // empties todo window
    const emptyTodoView = () => {
        todoView.innerHTML = '';
    }

    // rendering the todo overview

    const renderTodos = project => {
        emptyTodoView();
        mode = 'card';
        renderTodoHeader(project.title);
        const todoListing = create('div', todoView, null);
        todoListing.className = 'todo-listing';
        for (let todo of project.todos) todoListing.appendChild(renderTodo(todo));
        create('button', todoView, 'Add a Todo').addEventListener('click', () => {
            CONTROL.addTodo();
        });
    }

    const renderTodoHeader = title => {
        create('h1', todoView, title);
        create('button', todoView, 'Delete this Project').addEventListener('click', () => {
            CONTROL.deleteProject();
        });
    }

    const renderTodo = todo => {
        // parent node
        const todoCard = create('div', null, null);
        todoCard.className = 'todo card';
        // rendering details
        create('h2', todoCard, todo.title).className = 'title'
        create('p', todoCard, todo.due).className = 'due';
        if (todo.due != 'no due date') create('small', todoCard, todo.distance);
        create('div', todoCard, todo.priority).className = 'priority';
        create('p', todoCard, todo.description).className = 'description';
        // rendering checklist
        const list = makeTaskList(todo)
        todoCard.appendChild(list);
        // the edit button
        const edit = create('button', todoCard, 'Edit');
        edit.className = 'edit';
        edit.addEventListener('click', CONTROL.renderIsolatedTodo.bind(CONTROL, todo));
        return todoCard;
    }

    // making tasklists

    const renderTask = (description, index) => {
        let task = create('li', null, null);
        task.className = 'task';
        let check = create('input', task, null);
        check.setAttribute('type', 'checkbox');
        switch (mode) {
            case 'card':
                create('span', task, description);
                break;
            case 'isolate':
                task.appendChild(makeEditable(description, 'desc'));
                create('button', task, 'Remove').addEventListener('click', () => {
                    CONTROL.removeTask(index + 1);
                    CONTROL.renderIsolatedTodo();
                });
                break;
        }
        return task;
    }

    const addToTaskList = (t, index) => {
        const addition = renderTask(t.desc, index);
        const check = addition.querySelector('input');
        if (t.done) check.checked = 'checked';
        check.addEventListener('click', CONTROL.toggleTask.bind(CONTROL, t));
        if (mode == 'isolate') {
            addition.querySelector('button').dataset.index = index;
        }
        return addition;
    }

    const makeTaskList = todo => {
        const taskList = create('ul', null, null);
        taskList.className = 'task-list';
        for (let t of todo.tasks) taskList.appendChild(addToTaskList(t, todo.tasks.indexOf(t)));
        return taskList;
    }

    // renders a todo in isolation

    const renderIsolatedTodo = (todo, index) => {
        emptyTodoView();
        mode = 'isolate';
        const isolatedTodo = create('div', todoView, null);
        isolatedTodo.className = 'todo isolate';
        isolatedTodo.dataset.index = index;
        isolatedTodo.append(
            makeEditable(todo.title, 'title'),
            makeEditable(todo.due, 'due'),
            makeEditable(todo.priority, 'priority'),
            makeEditable(todo.description, 'description')
        );
        isolatedTodo.appendChild(makeTaskList(todo));

        const addTask = create('input', isolatedTodo, null);
        addTask.setAttribute('type', 'text');
        addTask.setAttribute('placeholder', 'Add new task...');

        const addTaskSubmit = create('button', isolatedTodo, 'Add');
        addTaskSubmit.addEventListener('click', () => {
            CONTROL.addTask(addTask.value.toString());
            CONTROL.renderIsolatedTodo();
        });

        const close = create('button', isolatedTodo, 'Close');
        close.className = 'close';
        close.addEventListener('click', CONTROL.renderTodos.bind(CONTROL, undefined));

        const deleteTodo = create('button', isolatedTodo, 'Delete Todo');
        deleteTodo.className = 'delete-todo';
        deleteTodo.addEventListener('click', () => {
            deleteTodo.textContent = 'Are you sure?';
            deleteTodo.addEventListener('click', () => {
                CONTROL.removeTodo(index);
            });
        });
    }

    const makeEditable = (todoDetail, detailType) => {
        const editable = create('div', null, null);
        editable.classList.add(detailType);
        create('span', editable, todoDetail);
        create('button', editable, 'Edit').addEventListener('click', enterEditMode.bind(VIEW, editable));
        return editable;
    }

    const enterEditMode = editable => {
        const text = editable.querySelector('span');
        const edit = editable.querySelector('button');
        const placeholder = editable.querySelector('span').textContent;
        // in case we're dealing with a task description edit
        const index = edit.dataset.index;
        // determining the html input type to use for each detail
        let inputType;
        if (editable.className == 'description') { inputType = 'textarea'; }
        else if (editable.className == 'priority') { inputType = 'select'; }
        else { inputType = 'input'; };
        // preparing for and making the swap of elements
        const editField = create(inputType, null, null);
        const editSubmit = create('button', null, 'Submit');
        // swap!
        editable.replaceChild(editSubmit, edit);
        editable.replaceChild(editField, text);

        determineEditType(editable, editField, placeholder);
        editSubmit.addEventListener('click', performEdit.bind(VIEW, editField, index));
    }

    const determineEditType = (editable, field, placeholder) => {
        switch (editable.className) {
            case 'title':
                field.setAttribute('type', 'text');
                field.setAttribute('placeholder', placeholder);
                break;
            case 'due':
                field.setAttribute('type', 'date');
                break;
            case 'priority':
                const none = create('option', field, 'none');
                none.setAttribute('value', 'none');
                const low = create('option', field, 'low');
                low.setAttribute('value', 'low');
                const medium = create('option', field, 'medium');
                medium.setAttribute('value', 'medium');
                const high = create('option', field, 'high');
                high.setAttribute('value', 'high');
                break;
            case 'description':
                field.setAttribute('placeholder', placeholder);
                break;
            case 'desc':
                field.setAttribute('type', 'text');
                field.setAttribute('placeholder', placeholder);
                break;
        }
    }

    const performEdit = (field, index) => {
        const type = field.parentNode.className;
        if (index != undefined) CONTROL.setTaskInFocus(index);
        if (field.value == '') {
            console.warn('Nothing changed.');
            CONTROL.renderIsolatedTodo();
        } else {
            switch (type) {
                case 'title':
                    CONTROL.changeTodoTitle(field.value.toString());
                    break;
                case 'due':
                    CONTROL.changeTodoDue(field.valueAsDate);
                    break;
                case 'priority':
                    CONTROL.changeTodoPriority(field.value);
                    break;
                case 'description':
                    CONTROL.changeTodoDescription(field.value);
                    break;
                case 'desc':
                    CONTROL.changeTaskDescription(field.value);
                    break;
            }
        }
    }

    return {
        emptyTodoView,
        renderTodos,
        renderIsolatedTodo,
        renderProjects,
        setActiveProject,
        updateProjectStats,
        renderSplash
    }
})(Base.projectView, Base.todoView);