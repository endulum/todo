import {format, formatDistanceToNow} from 'date-fns';

const Task = (description, done = false) => {
    return {
        get description() {return description},
        get done() {return done},
        toggle: () => done = !done,
        edit: text => description = text,
    }
}

// // testing the task factory

// let laundry = Task('wash the laundry');

// console.log(laundry.done);
// laundry.toggle();
// console.log(laundry.done);

// console.log(laundry.description);
// laundry.edit('dry the laundry');
// console.log(laundry.description);

const Todo = (title, priority = 'no priority', due = 0, description = '') => {
    const tasks = [];
    return {
        // basic getters
        get tasks() {return tasks},
        get title() {return title},
        get priority() {return priority},
        get due() {return due},
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
        // setters for the details
        set title(text) {title = text.toString()},
        set priority(number) {
            switch (number) {
                case 1: priority = 'low'; break;
                case 2: priority = 'medium'; break;
                case 3: priority = 'high'; break;
                default: priority = 'no priority'; break;
            }
        },
        set due(date) {
            if ((typeof date == 'object')) {due = date}
            else if (date == 0) {due = 0}
        },
        set description(text) {description = text.toString()},
        // FOR CONSOLE ONLY
        print: () => {
            let counter = 0;
            let list = `(${priority}) ${title}\n${description}\n`;
            if (due != 0) {
                list += `due on ${format(due, 'MM/dd/yyyy')} (${formatDistanceToNow((due), {addSuffix: true})})\n\n`;
            } else {
                list += `no due date\n\n`;
            }

            for (let task of tasks) {
                counter++;
                list += `${counter}. ${task.description}\n`;
            }
            list += `\n${counter} tasks total`
            return list;
        }
    }
}

// // testing the todo factory

// let chores = Todo('my chores');
// chores.add(Task('wash dishes'));
// chores.add(Task('make laundry'));
// chores.add(Task('cook lunch'));
// console.log(chores.print());
// chores.remove(2);
// console.log(chores.print());
// // test set title
// chores.title = 'your chores';
// console.log(chores.print());
// // test set description
// chores.description = 'lorem ipsum dolor sit amet';
// console.log(chores.print());
// // test set priority
// chores.priority = 3;
// console.log(chores.print());
// // test set due date
// chores.due = new Date(2023, 3, 2);
// console.log(chores.print());