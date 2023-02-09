import './styles/main.scss';
import {Task, Todo, Project} from './core.js';

const startup = (db => {
    console.warn('Immediately invoking startup. This should only happen once.');

    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    db.appendChild(wrapper);

    const sidebar = document.createElement('aside');
    sidebar.classList.add('sidebar');
    wrapper.appendChild(sidebar);

    const mainstuff = document.createElement('main');
    mainstuff.classList.add('main');
    wrapper.appendChild(mainstuff);

    const content = document.createElement('div');
    content.id = 'content';
    mainstuff.appendChild(content);

    const projects = document.createElement('ul');
    projects.id = 'projects';
    sidebar.appendChild(projects);
    
})(document.body);

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
        document.querySelector('.sidebar').innerHTML = '';
        for (let project of projects) {
            let div = document.createElement('div');
            div.classList.add('project');

            let title = document.createElement('p');
            title.classList.add('project-title');
            title.textContent = project.title;

            let total = document.createElement('small');
            total.classList.add('project-total-tasks');
            total.textContent = `${project.totalTasks} total tasks`;

            let list = document.createElement('ul');
            list.classList.add('project-list');
            list.style.display = 'none';
            
            for (let todo of project.todos) {
                let listItem = document.createElement('li');
                listItem.textContent = todo.title;
                list.appendChild(listItem);
            }

            div.appendChild(title);
            div.appendChild(total);
            div.appendChild(list);

            document.querySelector('.sidebar').appendChild(div);

            div.addEventListener('click', () => {
                list.style.display = (list.style.display === 'none') ? 'block' : 'none' ;
            });
        }
    }

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
console.log(App.projects);