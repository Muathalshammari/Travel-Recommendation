let recommendations = [];
let pointer = 0;

function parseCSV(data) {
  const rows = data.split('\n');
  return rows.slice(1).map((row) => {
    const [name, address, rating] = row.split(',');
    return { name: name.trim(), address: address.trim(), rating: parseFloat(rating.trim()) || 0 };
  });
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
  const fileName = `data/${category}_${city}.csv`;

  fetch(fileName)
    .then((res) => res.text())
    .then((csv) => {
      recommendations = parseCSV(csv).sort((a, b) => b.rating - a.rating);
      pointer = 0;
      displayRecommendations();
    })
    .catch((err) => alert(`Error: ${err.message}`));
}
