import { compareAsc, format, formatDistance, formatDistanceToNow } from 'date-fns';

const Task = (description, done) => {
    const task = {
        description, 
        done, 
        toggle: () => task.done = !task.done,
        edit: text => task.description = text.toString()
    };
    return task;
}

const Todo = (title, priority, due, description) => {
    const tasks = [];

    const todo = {
        tasks,
        priority,
        title,
        due,
        description,
        add: task => tasks.push(task), 
        remove: number => tasks.splice(number - 1, 1), 
        total: () => {return tasks.length}, 
        totalDone: () => {
            let counter = 0;
            for (let task of tasks) {
                if (task.done) counter++;
            }
            return counter;
        },

        list: () => { // FOR CONSOLE
            let counter = 0;
            let list = `(${todo.priority}) ${todo.title}, due on ${format(todo.due, 'MM/dd/yyyy')} (${formatDistanceToNow((todo.due), {addSuffix: true})})\n${todo.description}\n`;
            for (let task of tasks) {
                counter++;
                list += `${counter}. ${task.description}\n`;
            }
            return list;
        },

        editTitle: text => todo.title = text.toString(),
        editPriority: text => todo.priority = text.toString(),
        editDate: date => todo.due = date,
        editDescription: text => todo.description = text.toString(),
    };

    return todo;
}

const chores = Todo('chores', 'high', new Date(2023, 1, 14), 'stuff to do around the house');
chores.add(Task('walk the dog', true));
chores.add(Task('do the dishes', true));
chores.add(Task('make laundry', true));
console.log(chores.list());

chores.remove(2);
console.log(chores.list());
chores.editTitle('my chores');
console.log(chores.list());

chores.editDate(new Date(2023, 1, 15));
console.log(chores.list());

chores.editDescription('stuff i gotta do around the house');
console.log(chores.list());

chores.editPriority('low');
console.log(chores.list());