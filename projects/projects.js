import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectCount = projects.length;
document.querySelector('.projects-title').textContent = `${projectCount} Projects`

let query = '';
let searchInput = document.querySelector('.searchBar');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year }; // TODO
    });
    // re-calculate slice generator, arc data, arc, etc.

    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    // TODO: clear up paths and legends
    let newSVG = d3.select('svg'); 
    newSVG.selectAll('path').remove();
    let newLegend = d3.select('.legend');
    newLegend.selectAll('li').remove();
    // update paths and legends, refer to steps 1.4 and 2.2
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    
    newArcs.forEach((arc, i) => {
        d3.select('svg')
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                newSVG
                    .selectAll('path')
                    .attr('class', (_, idx) => (
                        idx == selectedIndex ? "selected" : ""
                    ));
                legend
                    .selectAll('li')
                    .attr('class', (_, idx) => (
                        idx == selectedIndex ? "legend-item selected" : "legend-item"
                    ));

                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    const year = newData[selectedIndex].label;
                    renderProjects(projects.filter((project) => project.year == year), projectsContainer, 'h2');
                }
                
            });
    })

    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    })
}
  
  // Call this function on page load
renderPieChart(projects);

searchInput.addEventListener('change', (event) => {

    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

let selectedIndex = -1;

