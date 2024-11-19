document.addEventListener('DOMContentLoaded', () => {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
  
    let selectedCity = null;
    let selectedCategory = null;
  
    const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];
    const categories = ['museums', 'restaurants', 'cafes'];
  
    fetch('chatbot_data.json')
      .then((response) => response.json())
      .then((chatbotData) => {
        sendBtn.addEventListener('click', () => handleUserMessage(chatbotData));
      });
  
      function handleUserMessage(chatbotData) {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
      
        appendMessage('user', userMessage);
        chatInput.value = '';
      
        if (!selectedCity) {
          const cityResponse = handleCitySelection(userMessage, cities);
          if (cityResponse) {
            appendMessage('bot', cityResponse);
            return;
          }
        }
      
        if (selectedCity && !selectedCategory) {
          const categoryResponse = handleCategorySelection(userMessage, categories);
          if (categoryResponse) {
            appendMessage('bot', categoryResponse);
            return;
          }
        }
      
        if (selectedCity && selectedCategory) {
          getRecommendations(selectedCity, selectedCategory)
            .then((recommendations) => appendMessage('bot', recommendations))
            .catch((error) => appendMessage('bot', `Error: ${error.message}`));
          resetSelection();
          return;
        }
      
        const botResponse = getBotResponse(userMessage, chatbotData);
        setTimeout(() => appendMessage('bot', botResponse), 500);
      }
      
  
    function handleCitySelection(message, cities) {
      const city = cities.find((c) => message.toLowerCase().includes(c.toLowerCase()));
      if (city) {
        selectedCity = city;
        return `You selected ${city}. Now, choose a category: museums, restaurants, or cafes.`;
      }
      return `Please select a city: ${cities.join(', ')}`;
    }
  
    function handleCategorySelection(message, categories) {
      const category = categories.find((cat) => message.toLowerCase().includes(cat));
      if (category) {
        selectedCategory = category;
        return `Great! You've chosen ${category}. Let me find the best places in ${selectedCity}.`;
      }
      return `Please choose a category: ${categories.join(', ')}`;
    }
  
    function getRecommendations(city, category) {
        // Construct the file name based on city and category
        const fileName = `${category.toLowerCase()}_${city.toLowerCase()}.csv`;
      
        return fetch(fileName)
          .then((response) => {
            if (!response.ok) throw new Error(`File ${fileName} not found`);
            return response.text();
          })
          .then((csvData) => {
            const places = parseCSV(csvData);
      
            if (places.length > 0) {
              const recommendations = places
                .map((place) => `<a href="${place.url}" target="_blank">${place.name}</a> - Rating: ${place.rating}`)
                .join('<br>');
              return `Here are the best ${category} in ${city}:<br>${recommendations}`;
            } else {
              return `Sorry, no ${category} found in ${city}.`;
            }
          })
          .catch((error) => `Error loading recommendations: ${error.message}`);
      }
      
  
      function parseCSV(data) {
        const rows = data.split('\n');
        return rows.slice(1).map((row) => {
          const [name, rating, lat, lng, url] = row.split(',');
          return { name, rating: parseFloat(rating), lat, lng, url };
        });
      }
      
    function resetSelection() {
      selectedCity = null;
      selectedCategory = null;
    }
  
    function getBotResponse(message, chatbotData) {
      const lowerCaseMessage = message.toLowerCase();
  
      for (const entry of chatbotData.responses) {
        if (entry.keywords.some((keyword) => lowerCaseMessage.includes(keyword))) {
          return entry.response;
        }
      }
  
      return "Sorry, I don't understand that. Can you rephrase?";
    }
  
    function appendMessage(sender, message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
      messageDiv.innerHTML = message;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
  });
  