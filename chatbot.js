document.addEventListener('DOMContentLoaded', () => {
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  let selectedCity = null;
  let selectedCategory = null;

  const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'];
  const categories = ['museums', 'restaurants', 'cafes'];

  sendBtn.addEventListener('click', () => handleUserMessage());

  function handleUserMessage() {
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
      appendMessage('bot', `Fetching recommendations for ${selectedCategory} in ${selectedCity}...`);
      getRecommendations(selectedCity, selectedCategory);
      resetSelection(); // Reset after providing recommendations
      return;
    }

    appendMessage('bot', "Sorry, I didn't understand that. Can you rephrase?");
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
    const category = categories.find((cat) => message.toLowerCase().includes(cat.toLowerCase()));
    if (category) {
      selectedCategory = category;
      return `Great! You've chosen ${category}. Let me find the best places in ${selectedCity}.`;
    }
    return `Please choose a category: ${categories.join(', ')}`;
  }

  function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function resetSelection() {
    selectedCity = null;
    selectedCategory = null;
  }
});
