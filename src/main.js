// src/main.js
function greet() {
    const greeting = document.getElementById('greeting');
    greeting.textContent = 'Hello from src/main.js!';
}

document.addEventListener('DOMContentLoaded', greet);