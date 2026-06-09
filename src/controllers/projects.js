// Import any needed model functions
import { body, validationResult } from 'express-validator';
import { getUpcomingProjects, getProjectDetails, createProject, updateProject, addVolunteer, removeVolunteer, checkVolunteeringStatus } from '../models/projects.js';
import { getCategoriesByProject } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

// Constant for the number of upcoming projects to display
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define controller functions

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

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

        // Check volunteering status if user is logged in
        let isVolunteering = false;
        if (req.session && req.session.user) {
            const userId = req.session.user.user_id || req.session.user.id;
            isVolunteering = await checkVolunteeringStatus(userId, projectId);
        }

        const title = project.title;
        
        // Render the service project details page view (project.ejs)
        res.render('project', { 
            title, 
            project, 
            categories, 
            user: req.session.user || null, 
            isVolunteering 
        });
    } catch (error) {
        console.error("Error in showProjectDetailsPage controller:", error);
        res.status(500).render('errors/500', { title: 'Server Error' });
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project: ', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// Display the Edit Service Project form
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    // Get current project details and all available organizations
    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();
    
    const title = `Edit ${projectDetails.title}`;

    res.render('update-project', { title, projectDetails, organizations, messages: req.flash() });
};

// Process the update submission
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        
        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating service project', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

/* ******************************************
 *  VOLUNTEER PROCESSORS (W06 Assignment)
 * ****************************************** */

// Process adding a user as a volunteer
const processAddVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id || req.session.user.id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have successfully signed up as a volunteer for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error in processAddVolunteer:", error);
        req.flash('error', 'Could not sign up for volunteering at this moment.');
        res.redirect(`/project/${projectId}`);
    }
};

// Process removing a user from volunteering
const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id || req.session.user.id;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'Your volunteering registration has been removed.');
        
        const referer = req.get('Referrer') || '';
        if (referer.includes('dashboard')) {
            return res.redirect('/dashboard');
        }
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error in processRemoveVolunteer:", error);
        req.flash('error', 'Could not cancel volunteering registration.');
        res.redirect(`/project/${projectId}`);
    }
};

// Export controller functions
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm, processAddVolunteer, processRemoveVolunteer };
