// Import any needed model functions
import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, getCategoriesByProject, updateCategoryAssignments, addCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails, getProjectsByCategory } from '../models/projects.js';

const categoryValidation = [
  body('category_name')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Please provide a category name.')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters.')
];

// Define controller functions
const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Project Categories';
  res.render('categories', { title, categories });
};

// Create a new controller function for the category details page
const getCategoryDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const categoryRows = await getCategoryById(categoryId);
    const projectRows = await getProjectsByCategory(categoryId);

    if (!categoryRows || categoryRows.length === 0) {
      return res.status(404).render('errors/404', { title: 'Category Not Found' });
    }

    const category = categoryRows[0];

    res.render('categories-details', {
      title: category.name,
      categoryDetails: category,
      projects: projectRows
    });

  } catch (error) {
    console.error("Error fetching category details:", error);
    res.status(500).render('errors/500', { 
      title: 'Server Error',
      error: error,
      stack: error.stack
    });
  }
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProject(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    
    await updateCategoryAssignments(projectId, categoryIdsArray);
    
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showCreateCategoryForm = async (req, res) => {
  res.render('new-category', {
    title: 'Create New Category'
  });
};

const processCreateCategory = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-category');
  }

  const { category_name } = req.body;
  try {
    await addCategory(category_name);
    req.flash('success', 'Category added successfully!');
    res.redirect('/categories');
  } catch (error) {
    req.flash('error', 'Sorry, creating the category failed.');
    res.redirect('/new-category');
  }
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const categoryRows = await getCategoryById(categoryId);
  const category = categoryRows[0];

  res.render('edit-category', {
    title: 'Edit Category',
    categoryDetails: category
  });
};

const processEditCategory = async (req, res) => {
  const results = validationResult(req);
  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect(`/edit-category/${req.body.category_id}`);
  }

  const { category_id, category_name } = req.body;
  try {
    await updateCategory(category_id, category_name);
    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');
  } catch (error) {
    req.flash('error', 'Sorry, the update failed.');
    res.redirect(`/edit-category/${category_id}`);
  }
};

export { 
  showCategoriesPage, 
  getCategoryDetails, 
  showAssignCategoriesForm, 
  processAssignCategoriesForm,
  showCreateCategoryForm,
  processCreateCategory,
  showEditCategoryForm,
  processEditCategory,
  categoryValidation
};