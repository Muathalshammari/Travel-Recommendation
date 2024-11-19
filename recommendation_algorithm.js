function parseCSV(data) {
  // Parse CSV data into an array of objects
  const rows = data.split('\n');
  return rows.slice(1).map((row) => {
    const [name, link, reviews] = row.split(',');
    return { name: name.trim(), link: link.trim(), reviews: parseInt(reviews.trim(), 10) };
  });
}

function getRecommendations(city, category) {
  // Construct the file name based on city and category
  const fileName = `data/${category.toLowerCase()}_${city.toLowerCase()}.csv`;

  // Fetch the CSV file
  fetch(fileName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`File not found: ${fileName}`);
      }
      return response.text();
    })
    .then((csvData) => {
      const places = parseCSV(csvData);

      if (places.length > 0) {
        // Display the recommendations
        const list = document.getElementById('places-list');
        list.innerHTML = ''; // Clear previous results
        places.forEach((place) => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${place.link}" target="_blank">${place.name}</a> - Reviews: ${place.reviews}`;
          list.appendChild(li);
        });
      } else {
        alert(`No results found for ${category} in ${city}.`);
      }
    })
    .catch((error) => {
      alert(`Error loading recommendations: ${error.message}`);
    });
}
