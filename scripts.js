// Global variables
let allProjects = [];
let showingSelected = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  // Load projects data
  loadProjects();
  
  // Initialize animation delays for sections
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Add event listener for toggle button
  const toggleButton = document.getElementById('toggle-projects');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleProjects);
  }
});

// Load projects from JSON file
function loadProjects() {
  fetch('projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Projects loaded successfully:", data);
      allProjects = data.projects;
      renderProjects(true);
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      // Create fallback projects display if JSON loading fails
      displayFallbackProjects();
    });
}

// Fallback if JSON loading fails
function displayFallbackProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = `Error loading projects.`;
}

// Toggle between showing all or selected projects
function toggleProjects() {
  showingSelected = !showingSelected;
  renderProjects(showingSelected);
  
  // Update button text
  const toggleButton = document.getElementById('toggle-projects');
  toggleButton.textContent = showingSelected ? 'Show All' : 'Show Selected';
  const toggleHeader = document.getElementById('toggle-header');
  toggleHeader.textContent = showingSelected ? 'Selected Projects' : 'All Projects';
}

// Render projects based on selection state
function renderProjects(selectedOnly) {
  const projectsContainer = document.getElementById('projects-container');
  projectsContainer.innerHTML = '';
  
  const pubsToShow = selectedOnly ? 
    allProjects.filter(pub => pub.selected === 1) : 
    allProjects;
  
  pubsToShow.forEach(project => {
    const pubElement = createProjectElement(project);
    projectsContainer.appendChild(pubElement);
  });
}

// Create HTML element for a project
function createProjectElement(project) {
  const pubItem = document.createElement('div');
  pubItem.className = 'project-item';
  
  // Create thumbnail
  const thumbnail = document.createElement('div');
  thumbnail.className = 'pub-thumbnail';
  thumbnail.onclick = () => openModal(project.thumbnail);
  
  const thumbnailImg = document.createElement('img');
  thumbnailImg.src = project.thumbnail;
  thumbnailImg.alt = `${project.title} thumbnail`;
  thumbnail.appendChild(thumbnailImg);
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'pub-content';
  
  // Add title
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = project.title;
  content.appendChild(title);
  
  // Add authors with highlight
  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  
  // Format authors with highlighting
  let authorsHTML = '';
  project.authors.forEach((author, index) => {
    if (author.includes('Author 3')) { // TODO: Highlight specific author
      authorsHTML += `<span class="highlight-name">${author}</span>`;
    } else {
      authorsHTML += author;
    }
    
    if (index < project.authors.length - 1) {
      authorsHTML += ', ';
    }
  });
  
  authors.innerHTML = authorsHTML;
  content.appendChild(authors);
  
  // Add venue with award if present
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';
  
  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = project.venue;
  venueContainer.appendChild(venue);
  
  // // Add award if it exists
  // if (project.award && project.award.length > 0) {
  //   const award = document.createElement('div');
  //   award.className = 'pub-award';
  //   award.textContent = project.award;
  //   venueContainer.appendChild(award);
  // }
  
  content.appendChild(venueContainer);

  // Add keywords
  const keywordContainer = document.createElement('div');
  keywordContainer.className = 'pub-keyword-container';
  
  const keyword = document.createElement('div');
  keyword.className = 'pub-keyword';
  keyword.textContent = project.keyword;
  keywordContainer.appendChild(keyword);
  
  content.appendChild(keywordContainer);

  
  // Add links if they exist
  if (project.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';
    
    if (project.links.pdf) {
      const pdfLink = document.createElement('a');
      pdfLink.href = project.links.pdf;
      pdfLink.textContent = '[PDF]';
      links.appendChild(pdfLink);
    }

    if (project.links.article) {
      const articleLink = document.createElement('a');
      articleLink.href = project.links.article;
      articleLink.textContent = '[Article]';
      links.appendChild(articleLink);
    }
    
    if (project.links.code) {
      const codeLink = document.createElement('a');
      codeLink.href = project.links.code;
      codeLink.textContent = '[Code]';
      links.appendChild(codeLink);
    }
    
    if (project.links.page) {
      const pageLink = document.createElement('a');
      pageLink.href = project.links.page;
      pageLink.textContent = '[Page]';
      links.appendChild(pageLink);
    }
    
    content.appendChild(links);
  }
  
  // Assemble the project item
  pubItem.appendChild(thumbnail);
  pubItem.appendChild(content);
  
  return pubItem;
}

// Modal functionality for viewing original images
function openModal(imageSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close modal when clicking outside the image
window.onclick = function(event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    closeModal();
  }
}
