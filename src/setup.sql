CREATE TABLE public.organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO public.organizations (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES organization(organization_id) 
        ON DELETE CASCADE
);

INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Painting and structural repairs to the downtown youth center.', 'Downtown Hub', '2026-06-15'),
(1, 'Park Bench Installation', 'Building and placing new benches along the riverside park.', 'Riverside Park', '2026-07-22'),
(1, 'School Ramp Construction', 'Building wheelchair accessible ramps at the local elementary school.', 'Westside Elementary', '2026-08-05'),
(1, 'Library Shelving Upgrade', 'Assembling new bookshelves for the community library expansion.', 'Public Library', '2026-09-12'),
(1, 'Shelter Roof Repair', 'Fixing leaks and replacing tiles on the local animal shelter roof.', 'Animal Shelter', '2026-10-18'),

(2, 'Community Garden Planting', 'Sowing spring vegetables and setting up irrigation systems.', 'North Ward Plot', '2026-05-20'),
(2, 'Urban Orchard Pruning', 'Seasonal pruning and care for the community fruit trees.', 'East Side Orchard', '2026-06-10'),
(2, 'Compost Bin Workshop', 'Building large-scale compost bins for neighborhood organic waste.', 'Eco Center', '2026-07-14'),
(2, 'School Greenhouse Setup', 'Assembling a small greenhouse for educational purposes.', 'High School Campus', '2026-08-25'),
(2, 'Harvest Festival Prep', 'Organizing and packing produce baskets for the seasonal market.', 'Central Square', '2026-09-30'),

(3, 'Food Drive Sorting', 'Categorizing and boxing non-perishable food donations.', 'Food Bank Warehouse', '2026-05-28'),
(3, 'Senior Tech Support Day', 'Teaching elderly citizens how to use smartphones and video calls.', 'Senior Center', '2026-06-18'),
(3, 'Beach Clean-up Drive', 'Removing plastic waste and debris from the local coastline.', 'South Beach', '2026-07-09'),
(3, 'School Supplies Packing', 'Filling backpacks with notebooks and pencils for low-income students.', 'Community Hall', '2026-08-11'),
(3, 'Warm Coats Distribution', 'Sorting and handing out winter coats to families in need.', 'Civic Center', '2026-11-04');