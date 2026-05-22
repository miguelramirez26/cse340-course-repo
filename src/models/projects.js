import db from './db.js';

const getAllProjects = async () => {
  try {
    const query = `
      SELECT p.project_id, p.title, p.description, p.location, p.date, o.name AS organization_name
      FROM project p
      JOIN organizations o ON p.organization_id = o.organization_id
      ORDER BY p.date ASC
    `;
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
    SELECT 
      project_id,
      organization_id,
      title,
      description,
      location,
      date
    FROM project
    WHERE organization_id = $1
    ORDER BY date;
  `;
  
  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);
  
  return result.rows;
};

// Get a limited number of upcoming projects ordered by date
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date, p.organization_id, o.name AS organization_name
        FROM project p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date, p.organization_id, o.name AS organization_name
        FROM project p
        JOIN organizations o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const result = await db.query(query, [id]);
    // Returns a single service project object, or null if not found
    return result.rows.length > 0 ? result.rows[0] : null; 
};

// Retrieve all service projects for a given category
const getProjectsByCategory = async (categoryId) => {
  try {
    const query = `
      SELECT p.* 
      FROM public.project p
      JOIN public.project_category pc ON p.project_id = pc.project_id
      WHERE pc.category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching projects by category:", error);
    throw error;
  }
};

// Export all functions
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails,
    getProjectsByCategory
};