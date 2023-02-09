import './styles/main.scss';
import { startup } from './modules/startup';
import { Task, Todo, Project } from './core.js';
import { App } from './modules/app';




let defaultProject = Project('Default');
let chores = Todo('My Chores');
let hobbies = Todo('My Hobbies');
chores.add(Task('wash the dishes'));
chores.add(Task('do the laundry'));
chores.add(Task('walk the dog'));
chores.add(Task('cook dinner'));
chores.add(Task('clean room'));
chores.due = new Date(2023, 3, 3);
chores.description = "Lorem ipsum dolor sit amet.";
hobbies.add(Task('watch a movie'));
hobbies.add(Task('paint a picture'));
hobbies.add(Task('read a book'));
defaultProject.add(hobbies);
defaultProject.add(chores);
App.add(defaultProject);
let otherProject = Project('Work');
let homework = Todo('Homework');
homework.add(Task('Textbook reading'));
homework.add(Task('Study for upcoming quiz'));
homework.add(Task('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'));
homework.add(Task('Attend counseling'));
let career = Todo('Job Stuff');
career.add(Task('Board meeting'));
career.add('Fix bug');
otherProject.add(homework);
otherProject.add(career);
App.add(otherProject);