import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { showCategoriesPage, getCategoryDetails, showAssignCategoriesForm, processAssignCategoriesForm, showCreateCategoryForm, processCreateCategory, showEditCategoryForm, processEditCategory, categoryValidation } from './controllers/categories.js';
import { triggerTestError } from './controllers/errors.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole, showUsersPage } from './controllers/users.js';

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for a single category details page
router.get('/category/:id', getCategoryDetails);

// Route for a single service project details page
router.get('/project/:id', showProjectDetailsPage);

// error-handling routes
router.get('/test-error', triggerTestError);

// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// Routes to handle editing a service project
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// Routes to handle adding a new category
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processCreateCategory);

// Routes to handle editing a category
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategory);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login and logout routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dahsboard route
router.get('/dashboard', requireLogin, showDashboard);

// Administrative route to manage registered system users
router.get('/users', requireRole('admin'), showUsersPage);

export default router;
