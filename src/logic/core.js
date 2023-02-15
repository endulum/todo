import {format, formatDistanceToNow} from 'date-fns';

export const Task = (description, done = false) => {
    return {
        get description() {return description},
        get done() {return done},
        toggle: () => done = !done,
        edit: text => description = text,
    }
}

export const Todo = title => {
    const tasks = [];
    let priority = 'none';
    let due = 0;
    let description = '';
    return {
        // basic getters
        get tasks() {return tasks},
        get title() {return title},
        get priority() {return priority},
        get due() {
            if (due != 0) return `due on ${format(due, 'MMMM d, yyyy')}`;
            else return 'no due date';
        },
        get distance() {
            if (due != 0) return formatDistanceToNow(due, {addSuffix: true});
        },
        get description() {return description},

        // further getters
        get total() {return tasks.length},
        get totalComplete() {
            let counter = 0;
            for (let task of tasks) {
                if (task.done) counter++;
            }; 
            return counter;
        },

        // editions to the tasklist
        add: task => tasks.push(task),
        remove: number => tasks.splice(number - 1, 1),

        // find index of a task based on description
        index: description => {
            return tasks.findIndex(d => d.description = description);
        },

        // setters for the details
        set title(text) {title = text.toString()},
        set priority(p) {
            if (typeof p == 'number') {
                switch (number) {
                    case 1: priority = 'low'; break;
                    case 2: priority = 'medium'; break;
                    case 3: priority = 'high'; break;
                    default: priority = 'none'; break;
                }
            } else {priority = p.toString()};
        },
        set due(date) {
            if ((typeof date == 'object')) {due = date}
            else if (date == 0) {due = 0}
        },
        set description(text) {description = text.toString()},

        // // FOR CONSOLE ONLY
        print: () => {
            let counter = 0;
            let list = `(${priority}) ${title}\n`;
            if (description != '') {list += `${description}\n`}
            if (due != 0) {
                list += `due on ${format(due, 'MM/dd/yyyy')} (${formatDistanceToNow((due), {addSuffix: true})})\n\n`;
            } else {
                list += `no due date\n\n`;
            }
            for (let task of tasks) {
                counter++;
                list += `${counter}. ${task.description}`;
                if (task.done) list += ` (done!)`;
                list += `\n`
            }
            list += `\n${counter} tasks total`;
            return list;
        }
    }
}

export const Project = title => {
    const todos = [];
    return {
        // basic getters
        get todos() {return todos},
        get title() {return title},
        get total() {return todos.length},

        // counter getters
        get totalTasks() {
            let counter = 0;
            for (let todo of todos) {
                counter += todo.total;
            } return counter;
        },
        get totalTasksComplete() {
            let counter = 0;
            for (let todo of todos) {
                counter += todo.totalComplete;
            } return counter;
        },

        // find index of a todo based on title
        index: title => {
            return todos.findIndex(t => t.title = title);
        },

        // editions to the todolist
        add: todo => todos.unshift(todo),
        remove: index => todos.splice(index, 1),

        // setters
        set title(text) {title = text.toString()},

        // FOR CONSOLE ONLY
        print: () => {
            let counter = 0;
            let list = ''
            for (let todo of todos) {
                counter++;
                list += `${todo.title} - ${todo.totalComplete} out of ${todo.total} total items complete\n`;
            }
            let text = `${title} - ${counter} todos\n`;
            return text + list;
        }
    }
}