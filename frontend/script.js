// script.js

const API_BASE_URL = 'http://localhost:5000';
let loggedInUserId = null;

// Helper function to display messages
const displayMessage = (messageDivId, message, type = '') => {
    const messageDiv = document.getElementById(messageDivId);
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
};

// Helper function to handle API requests
const apiRequest = async (url, method = 'GET', body = null) => {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(`${API_BASE_URL}${url}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Function to handle user registration
async function registerUser(event) {
    event.preventDefault();
    const { name, email, age, password } = event.target.elements;

    try {
        const data = await apiRequest('/', 'POST', {
            name: name.value,
            email: email.value,
            age: age.value ? parseInt(age.value) : null,
            password: password.value,
        });

        displayMessage('registerMessage', 'Registration successful!', 'success');
        document.getElementById('registerForm').reset();

    } catch (error) {
        displayMessage('registerMessage', `Registration failed: ${error.message || 'Unknown error'}`, 'error');
    }
}

// Function to handle user login
async function loginUser(event) {
    event.preventDefault();
    const { loginEmail, loginPassword } = event.target.elements;

    try {
        const data = await apiRequest('/login', 'POST', {
            email: loginEmail.value,
            password: loginPassword.value,
        });

        displayMessage('loginMessage', 'Login successful!', 'success');
        document.getElementById('loginForm').reset();
        document.getElementById('userDetailsSection').style.display = 'block';
        document.getElementById('userDetails').style.display = 'block'; // Show userDetails div now!
        loggedInUserId = data.userId;
        document.getElementById('viewEmail').value = data.email;
        document.getElementById('updateName').value = data.name;
        document.getElementById('updateAge').value = data.age || '';
        document.getElementById('userId').value = data.userId;

    } catch (error) {
        displayMessage('loginMessage', `Login failed: ${error.message || 'Invalid credentials'}`, 'error');
    }
}

// Function to view user details
async function viewUserDetails() {
    if (!loggedInUserId) {
        console.error("No user logged in to view details.");
        return;
    }

    const userDetailsDiv = document.getElementById('userDetails');
    const viewErrorMessageDiv = document.getElementById('viewErrorMessage');
    userDetailsDiv.style.display = 'none';
    viewErrorMessageDiv.style.display = 'none';
    viewErrorMessageDiv.textContent = '';

    try {
        const user = await apiRequest(`/${loggedInUserId}`);
        document.getElementById('updateName').value = user.name;
        document.getElementById('updateEmail').value = user.email;
        document.getElementById('updateAge').value = user.age || '';
        document.getElementById('userId').value = user._id;
        userDetailsDiv.style.display = 'block';
    } catch (error) {
        viewErrorMessageDiv.textContent = 'Failed to fetch user details.';
        viewErrorMessageDiv.style.display = 'block';
    }
}


// Function to update user details
async function updateUserDetails(event) {
    event.preventDefault();
    const { updateName, updateAge, userId } = event.target.elements;

    try {
        await apiRequest(`/${userId.value}`, 'PATCH', {
            name: updateName.value,
            age: updateAge.value ? parseInt(updateAge.value) : null,
        });

        displayMessage('updateMessage', 'User details updated successfully!', 'success');

    } catch (error) {
        displayMessage('updateMessage', `Update failed: ${error.message || 'Unknown error'}`, 'error');
    }
}