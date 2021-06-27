async function signupFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (!username) {
        alert('Username is empty');
        return;
    }

    if (!password) {
        alert('Password is empty');
        return;
    }

    const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
            username,
            password
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    const responseBody = await response.json();
    // check the response status
    if (response.ok) {
        document.location.replace('/dashboard');
    }
    else if (responseBody?.message) {
        alert(responseBody.message);
    }
    else {
        alert(response.statusText);
    }

}

async function loginFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (!username) {
        alert('Username is empty');
        return;
    }

    if (!password) {
        alert('Password is empty');
        return;
    }

    const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
            username,
            password
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    const responseBody = await response.json();

    if (response.ok) {
        document.location.replace('/dashboard');
    }
    else if (responseBody?.message) {
        alert(responseBody.message);
    }
    else {
        alert(response.statusText);
    }
}

const login = document.querySelector('.login-form');
const signup = document.querySelector('.signup-form');
const swapLoginSignup = () => {

    login.classList.toggle('hidden');
    signup.classList.toggle('hidden');

}

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);

document.querySelector('.swap-login').addEventListener('click', swapLoginSignup);
document.querySelector('.swap-signup').addEventListener('click', swapLoginSignup);
