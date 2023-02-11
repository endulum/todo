import { Task, Todo, Project } from './core.js';

// sample content to develop ui with

let recipes = Todo('Recipes to Try', 1, undefined, 'Random and interesting recipes I found around the internet.');
recipes.add(Task('Shrimp fried rice'));
recipes.add(Task('Chicken noodle soup'));
recipes.add(Task('Cinnamon snickerdoodles'));
recipes.add(Task('Tuna salad sandwich'));

let art = Todo('Art Projects', 2, undefined, 'Creative projects to complete for portfolio.');
art.add(Task('Magazine collage'));
art.add(Task('Watrcolor painting'));
art.add(Task('Gouache painting'));
art.add(Task('Digital vector linework'));
art.add(Task('Papercraft'));
art.add(Task('Colored pencil portrait'));

let books = Todo('Books to Read', 2, undefined, 'Book recommendations I have been given by friends and other folks.');
books.add(Task('The Great Gatsby'));
books.add(Task('The Tragedy of Hamlet'));
books.add(Task('The Silmarillion'));

let movies = Todo('Movies to Watch', 1, undefined, 'Totally cool movies I want to watch.');
movies.add('Avengers: Infinity War');

let hobbies = Project('Personal Hobbies');
hobbies.add(recipes);
hobbies.add(art);
hobbies.add(books);
hobbies.add(movies);
hobbies.add(recipes);

let fams1 = Todo('Basic Hippalectryon', 2, undefined, 'It\'s not unheard of for dryads to form alliances with nature dragon clans.');
fams1.add(Task('One would think it would be blind to what\'s behind it.'));
fams1.add(Task('A cozy afternoon tea with all of your friends!'));
fams1.add(Task('The happiest fox.'));
fams1.add(Task('This Hippalectryon emits a frigid aura.'));
fams1.add(Task('Loud colors, quiet toy.'));
fams1.add(Task('Going in for a closer sniff of these fragrant lilies is ill advised.'));

let fams2 = Todo('Articulated Fidget Toy', 0, undefined, 'Sure, \'collector\'s item\' you might say. Might we suggest an axe that doesn\'t have teeth and eyeballs?');
fams2.add(Task('Baku are able to walk both the physical and ethereal plane.'));
fams2.add(Task('A delightful, enchanted Bogsneak marionette. No strings attached!'));
fams2.add(Task('These animated guardians grow from fallen trees.'));

let fams3 = Todo('Salt and Pepper', 3, undefined, 'Always remember to floss.');
fams3.add(Task('A petrified creature gains a second life.'));
fams3.add(Task('Basic bronco bird.'));
fams3.add(Task('It\'s not shaped like a friend.'));
fams3.add(Task('Giving new meaning to the phrase \"there\'s something in the bushes.\"'));

let fams4 = Todo('Filter Fiend', 1, undefined, 'This parrot has learned the ways of its crew, and pilfers all that shines.');
fams4.add(Task('This cannibalistic snail produces a powerful venom.'));
fams4.add(Task('An ending of narrative merit.'));

let fams5 = Todo('Eel of the Depths', 1, undefined, 'Many flocks of Raptorik have found life on the high seas is full of adventure... and shiny things!');
fams5.add(Task('Nature\'s shiny.'));
fams5.add(Task('It\'s a red-winged owlcat with a giant sword. Who did this?'));
fams5.add(Task('It\'s not shaped like a friend.'));
fams5.add(Task('Decidedly unpleasant to touch.'));
fams5.add(Task('A hoarder of fine gemstones and ancient fossils.'));

let fams6 = Todo('Spring Glade Lord', 2, undefined, 'Some dryads gain additional abilities with the changing of the seasons. Spring Lords hold dominion over most plant life in their homes during the season of new blooms.');
fams6.add(Task('The everyday, ho-hum sort of terror.'));
fams6.add(Task('For those that fancy terror.'));
fams6.add(Task('A frilly fren.'));

let familiars = Project('Familiar Dummy Text');
familiars.add(fams6);
familiars.add(fams5);
familiars.add(fams4);
familiars.add(fams3);
familiars.add(fams2);
familiars.add(fams1);

export {hobbies, familiars};