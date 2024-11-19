document.getElementById('auth-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (localStorage.getItem(username)) {
      const userData = JSON.parse(localStorage.getItem(username));
      if (userData.password === password) {
        sessionStorage.setItem('loggedInUser', username);
        window.location.href = 'recommendation.html';
      } else {
        alert('Invalid password!');
      }
    } else {
      alert('User not found. Please register.');
    }
  });
  
  document.getElementById('register-btn').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (!localStorage.getItem(username)) {
      localStorage.setItem(username, JSON.stringify({ username, password }));
      alert('Registration successful! You can now log in.');
    } else {
      alert('User already exists!');
    }
  });
  