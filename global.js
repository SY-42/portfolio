console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a")
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );
// currentLink?.classList.add('current');

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact'},
    { url: 'resume/', title: 'Resume'},
    { url: 'meta/', title: 'Meta'},
    { url: 'https://github.com/SY-42', title: 'Github'}
  ];
  
let nav = document.createElement('nav');
document.body.prepend(nav);
  
for (let p of pages) {
    let url = p.url;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );
    if(a.host != location.host){
        a.target = "_blank"
    }
    nav.append(a);

}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
      <option value='light dark'>Automatic</option>
			<option value='light'>Light</option>
      <option value='dark'>Dark</option>
		</select>
	</label>`
);

const setColor = (colorScheme) => {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
}

const select = document.querySelector('select');

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  setColor(event.target.value);
  localStorage.colorScheme = event.target.value;
});

if("colorScheme" in localStorage){
  setColor(localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data; 

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach(project => {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div>
        <p>${project.description}</p>
        <p class='project-year'>c. ${project.year}</p>
      </div>

    `;
    containerElement.appendChild(article);
  })
  
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

