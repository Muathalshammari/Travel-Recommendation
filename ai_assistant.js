// AI Assistant Logic
document.addEventListener('DOMContentLoaded', () => {
  const messagesDiv = document.getElementById('chatbot-messages');
  const userInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-btn');

  let selectedCity = null;
  let selectedCategory = null;

  const cities = ['Riyadh', 'Jeddah', 'Dammam'];
  const categories = ['restaurants', 'cafes', 'museums'];

  // Respond to user input
  sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    userInput.value = '';

    handleUserInput(userMessage);
  });

  // Append a message to the chat
  function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Handle user input
  function handleUserInput(message) {
    if (!selectedCity) {
      const city = cities.find((c) => message.toLowerCase().includes(c.toLowerCase()));
      if (city) {
        selectedCity = city;
        appendMessage('bot', `You selected ${city}. Now, choose a category: restaurants, cafes, or museums.`);
      } else {
        appendMessage('bot', `Please specify a city: ${cities.join(', ')}.`);
      }
      return;
    }

    if (!selectedCategory) {
      const category = categories.find((cat) => message.toLowerCase().includes(cat.toLowerCase()));
      if (category) {
        selectedCategory = category;
        appendMessage('bot', `Great! You've chosen ${category} in ${selectedCity}. Let me find the best places for you...`);
        getRecommendations(selectedCity, selectedCategory);
      } else {
        appendMessage('bot', `Please specify a category: ${categories.join(', ')}.`);
      }
      return;
    }

    // Reset selection if the user wants to restart
    if (message.toLowerCase().includes('restart')) {
      selectedCity = null;
      selectedCategory = null;
      appendMessage('bot', 'Let’s start over! Please specify a city.');
      return;
    }

    appendMessage('bot', "I'm sorry, I didn't understand that. Can you rephrase?");
  }

  // Fetch and display recommendations
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
        const recommendations = parseCSV(csvData).sort((a, b) => b.rating - a.rating);
        displayTopRecommendations(recommendations);
      })
      .catch((error) => {
        appendMessage('bot', `Error fetching recommendations: ${error.message}`);
      });
  }

  // Parse CSV data
  function parseCSV(data) {
    const rows = data.split('\n');
    return rows.slice(1).map((row) => {
      const [name, address, rating] = row.split(',');
      return {
        name: name.trim(),
        address: address.trim(),
        rating: parseFloat(rating.trim()) || 0,
      };
    });
  }

  // Display top 3 recommendations
  function displayTopRecommendations(recommendations) {
    if (recommendations.length === 0) {
      appendMessage('bot', 'No recommendations found.');
      return;
    }

    const topRecommendations = recommendations.slice(0, 3);
    const recommendationsText = topRecommendations
      .map((rec, index) => `${index + 1}. <strong>${rec.name}</strong> - ${rec.address} - Rating: ${rec.rating}`)
      .join('<br>');

    appendMessage('bot', `Here are the top 3 recommendations:<br>${recommendationsText}`);
    appendMessage('bot', 'If you’d like to see more, type "show more".');

    // Handle "show more" request
    let pointer = 3;
    const handleShowMore = () => {
      const nextBatch = recommendations.slice(pointer, pointer + 3);
      pointer += 3;

      if (nextBatch.length === 0) {
        appendMessage('bot', 'No more recommendations available.');
        sendButton.removeEventListener('click', handleShowMore);
        return;
      }

      const nextText = nextBatch
        .map((rec, index) => `${pointer - 3 + index + 1}. <strong>${rec.name}</strong> - ${rec.address} - Rating: ${rec.rating}`)
        .join('<br>');

      appendMessage('bot', `Here are more recommendations:<br>${nextText}`);
    };

    sendButton.addEventListener('click', () => {
      const userMessage = userInput.value.trim();
      if (userMessage.toLowerCase().includes('show more')) {
        handleShowMore();
      }
    });
  }
});
