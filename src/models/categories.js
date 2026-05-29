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

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

const addCategory = async (categoryName) => {
  try {
    const query = 'INSERT INTO public.categories (name) VALUES ($1) RETURNING *;';
    const result = await db.query(query, [categoryName]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

const updateCategory = async (categoryId, categoryName) => {
  try {
    const query = 'UPDATE public.categories SET name = $1 WHERE category_id = $2 RETURNING *;';
    const result = await db.query(query, [categoryName, categoryId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export { 
  getAllCategories,
  getCategoryById,
  getCategoriesByProject,
  updateCategoryAssignments,
  addCategory,
  updateCategory
};
