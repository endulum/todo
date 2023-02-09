import { $, create } from './basic';

export const startup = (db => {
    console.warn('Immediately invoking startup. This should only happen once.');

    const wrapper = create('div', 'wrapper', undefined, db);

    const sidebar = create('aside', 'sidebar', undefined, wrapper);

    const main = create('main', 'main', undefined, wrapper);

    const content = create('div', undefined, undefined, main);
    content.id = 'content';

    const projects = create('div', undefined, undefined, sidebar);
    projects.id = 'projects';
    
})(document.body);