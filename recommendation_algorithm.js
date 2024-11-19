function parseCSV(data) {
    const rows = data.split('\n');
    return rows.slice(1).map((row) => {
      const [name, link, reviews] = row.split(',');
      return { name, link, reviews: parseInt(reviews, 10) };
    });
  }
  
  function getRecommendations(city, category) {
    const fileName = `data/${category.toLowerCase()}_${city.toLowerCase()}.csv`;
  
    fetch(fileName)
      .then((response) => {
        if (!response.ok) throw new Error(`File not found: ${fileName}`);
        return response.text();
      })
      .then((csvData) => {
        const places = parseCSV(csvData);
        const list = document.getElementById('places-list');
        list.innerHTML = '';
  
        places.forEach((place) => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${place.link}" target="_blank">${place.name}</a> - Reviews: ${place.reviews}`;
          list.appendChild(li);
        });
      })
      .catch((error) => alert(`Error loading recommendations: ${error.message}`));
  }
  