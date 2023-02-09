export const startup = (db => {
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