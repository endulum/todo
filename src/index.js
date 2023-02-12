import './style.scss';

// logic for Task, Todo, and Project objects
import { Task, Todo, Project } from './logic/core.js';
import { hobbies, familiars } from './logic/dummy.js';

// iifes
import { Foundation, App } from './display';

App.add(hobbies);
App.add(familiars);

