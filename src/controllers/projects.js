// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';

// Constant for the number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define controller functions

// Display the main service projects page (limited to 5 upcoming projects)
const showProjectsPage = async (req, res) => {
    try {
        // Fetch only the next 5 upcoming projects using the constant
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error in showProjectsPage controller:", error);
        res.status(500).render('errors/500', { title: 'Server Error' });
    }
};

// Display a specific service project details page
const showProjectDetailsPage = async (req, res) => {
    try {
        // Extract the service project ID from the URL parameters
        const projectId = req.params.id;
        
        // Call the model function to get the project object
        const project = await getProjectDetails(projectId);

        // If the project doesn't exist, render a 404 error page
        if (!project) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }

        // Call the model function to get categories for this project
        const categories = await getCategoriesByProject(projectId);

        const title = project.title;
        
        // Render the service project details page view (project.ejs)
        res.render('project', { title, project, categories });
    } catch (error) {
        console.error("Error in showProjectDetailsPage controller:", error);
        res.status(500).render('errors/500', { title: 'Server Error' });
    }
};

// Export controller functions
export { showProjectsPage, showProjectDetailsPage };
