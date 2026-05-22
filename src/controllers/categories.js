// Import any needed model functions
import { getAllCategories, getCategoryById } from '../models/categories.js';
import { getProjectsByCategory } from '../models/projects.js';

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
      category: category,
      projects: projectRows
    });

  } catch (error) {
    console.error("Error fetching category details:", error);
    res.status(500).render('errors/500', { title: 'Server Error' });
  }
};


// Export controller functions
export { showCategoriesPage, getCategoryDetails };