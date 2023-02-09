import './styles/main.scss';
import { Task, Todo, Project } from './core.js';
import { $, create } from './modules/basic';
import { startup } from './modules/startup';
import { NoEmitOnErrorsPlugin } from 'webpack';


const App = (() => {
    console.warn('Immediately invoking App. This should only happen once.');

    const projects = [];

    const add = function(project) {
        projects.push(project);
        populateSidebar();
    }

    const remove = function(index) {
        projects.splice(index - 1, 1);
    }

    const populateSidebar = function() {
        $('.sidebar').innerHTML = '';
        for (let p of projects) {
            let project = create('div', 'project', undefined, $('.sidebar'));
            let title = create('p', 'project-title', p.title, project);
            let totalTasks = create('small', 'project-total-tasks', p.total, project);
            let todos = create('ul', 'project-todos', undefined, project);
            todos.style.display = 'none';
            for (let t of p.todos) {
                let todo = create('li', 'project-todo', undefined, todos);
                let priority = create('div', `todo-priority-${t.priority}`, undefined, todo);
                let todoTitle = create('span', 'todo-title', t.title, todo);
            };
            // title.addEventListener('click', () => {
            //     todos.style.display = (todos.style.display === 'none') ? 'block':'none';
            // })
        }
    }

    // const populateSidebar = function() {
    //     document.querySelector('.sidebar').innerHTML = '';
    //     for (let project of projects) {

            
    //         for (let todo of project.todos) {
    //             let listItem = document.createElement('li');
    //             listItem.textContent = todo.title;
    //             list.appendChild(listItem);
    //         }

    //         div.appendChild(title);
    //         div.appendChild(total);
    //         div.appendChild(list);

    //         document.querySelector('.sidebar').appendChild(div);

    //         title.addEventListener('click', () => {
    //             list.style.display = (list.style.display === 'none') ? 'block' : 'none' ;
    //         });
    //     }
    // }

    return {projects, add, remove}
})();



let project = Project('Default');
let chores = Todo('My Chores');
let hobbies = Todo('My Hobbies');
chores.add(Task('wash the dishes'));
chores.add(Task('do the laundry'));
chores.add(Task('walk the dog'));
chores.add(Task('cook dinner'));
chores.add(Task('walk the dog'));
hobbies.add(Task('watch a movie'));
hobbies.add(Task('paint a picture'));
hobbies.add(Task('read a book'));
project.add(hobbies);
project.add(chores);

App.add(project);
App.add(project);