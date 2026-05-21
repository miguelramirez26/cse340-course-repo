// Define controller functions
const showHomePage = async (req, res) => {
  const title = 'Home';
  res.render('home', { title });
};

// Export controller functions
export { showHomePage };
