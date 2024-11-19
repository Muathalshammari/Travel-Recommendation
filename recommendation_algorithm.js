let recommendations = [];
let pointer = 0;

function parseCSV(data) {
  try {
    const rows = data.split('\n');
    return rows.slice(1).map((row, index) => {
      const [name, address, rating] = row.split(',');
      if (!name || !address || isNaN(parseFloat(rating))) {
        console.warn(`Skipping invalid row ${index + 2}:`, row);
        return null; // Skip invalid rows
      }
      return { name: name.trim(), address: address.trim(), rating: parseFloat(rating.trim()) || 0 };
    }).filter(Boolean); // Remove null values
  } catch (error) {
    console.error('Error parsing CSV data:', error.message);
    return [];
  }
}


function displayRecommendations() {
  const list = document.getElementById('places-list');
  list.innerHTML = '';

  const nextBatch = recommendations.slice(pointer, pointer + 3);
  pointer += 3;

  if (nextBatch.length === 0) {
    alert('No more recommendations available.');
    return;
  }

  nextBatch.forEach((place) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${place.name}</strong> - ${place.address} - Rating: ${place.rating}`;
    list.appendChild(li);
  });

  if (pointer < recommendations.length) {
    const button = document.createElement('button');
    button.innerText = 'Show More Recommendations';
    button.onclick = displayRecommendations;
    list.appendChild(button);
  }
}

function getRecommendations(city, category) {
  const fileName = `data/${category.toLowerCase()}_${city.toLowerCase()}.csv`;

  fetch(fileName)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`File not found: ${fileName}`);
      }
      return response.text();
    })
    .then((csvData) => {
      console.log(`Fetched data from ${fileName}:`, csvData); // Log raw data for debugging
      recommendations = parseCSV(csvData).sort((a, b) => b.rating - a.rating); // Sort by rating
      pointer = 0;
      displayRecommendations();
    })
    .catch((error) => {
      console.error('Error fetching recommendations:', error.message);
      alert(`Error fetching recommendations: ${error.message}`);
    });
}

