
-- 1. What are the names of countries with population greater than 8 million?
SELECT Name FROM country WHERE Population > 8000000; 


-- 2. What are the names of countries that have "land" in their names?
SELECT Name FROM country WHERE Name ILIKE '%land%';

-- 3. What are the names of the cities with population in between 500,000 and 1 million?
SELECT Name FROM city WHERE Population between 500000 AND 1000000;


-- 4. What's the name of all the countries on the continent 'Europe'?
SELECT Name FROM country WHERE Continent LIKE 'Europe%';


-- 5. List all the countries in the descending order of their surface areas.
SELECT * FROM country ORDER BY SurfaceArea DESC;


-- 6. What are the names of all the cities in the Netherlands?
SELECT Name FROM city WHERE CountryCode IN (SELECT Code FROM country WHERE name like '%Netherlands%');


-- 7. What is the population of Rotterdam?
SELECT Population FROM city WHERE name like '%Rotterdam%';


-- 8. What's the top 10 countries by Surface Area?
SELECT Name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10;

-- 9. What's the top 10 most populated cities?
SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10; 

-- 10. What is the population number of the world?
SELECT SUM(Population) FROM country; 