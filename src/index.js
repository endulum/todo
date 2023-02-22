import './style.scss';

// logic for Task, Todo, and Project objects
import { Task, Todo, Project } from './logic/core.js';
import { hobbies, familiars } from './logic/dummy.js';
import { Base } from './display/base';

import { VIEW, CONTROL } from './display/gui';

CONTROL.renderProjects();