import './style.scss';

// logic for Task, Todo, and Project objects
import { Task, Todo, Project } from './logic/core.js';
import { hobbies, familiars } from './logic/dummy.js';

// app startup
import { App } from './display/interaction';

App.refreshProjectView();
