import db from './db.js';

const getAllCategories = async () => {
  try {
    const query = 'SELECT category_id, name FROM public.categories;';
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Retrieve a single category by its ID
const getCategoryById = async (categoryId) => {
  try {
    const query = 'SELECT * FROM public.categories WHERE category_id = $1;';
    const result = await db.query(query, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
}

// Retrieve all categories for a given service project
const getCategoriesByProject = async (projectId) => {
  try {
    const query = `
      SELECT c.* 
      FROM public.categories c
      JOIN public.project_category pc ON c.category_id = pc.category_id
      WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching categories by project:", error);
    throw error;
  }
}

export { 
  getAllCategories,
  getCategoryById,
  getCategoriesByProject
};
