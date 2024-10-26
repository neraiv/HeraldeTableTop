async function loginScreenConstruct() {
    return new Promise((resolve) => {
        const loginScreen = document.createElement('div');
        loginScreen.classList.add('login-screen');

        const loginForm = document.createElement('form');
        loginForm.classList.add('column', 'vertical', 'form-group', 'box-circular-border');
        loginForm.style.width = "300px";
        loginForm.style.height = "200px";
        loginScreen.appendChild(loginForm);

        const loginTitle = document.createElement('h1');
        loginTitle.textContent = 'Login';
        loginForm.appendChild(loginTitle);

        const usernameInput = createStringInput('User Name: ', {
            id: 'login-username',
        });
        loginForm.appendChild(usernameInput);

        const passwordInput = createStringInput('Password: ', {
            id: 'login-password',
        });
        loginForm.appendChild(passwordInput);

        const loginButton = document.createElement('button');
        loginButton.textContent = 'Login';
        loginButton.onclick = async (event) => {
            event.preventDefault(); // Prevent form submission

            const username = usernameInput.querySelector('.input-element').value;
            const password = passwordInput.querySelector('.input-element').value;

            user = await fetchLogin(username, password); // Await the login process

            if (user) {
                alert(`Logged in as ${user.type}`); // Adjusted alert for better display
                await startSyncTimer(); // Wait for startSyncTimer to complete
                loginScreen.remove(); // Remove login screen after successful login
                resolve(user); // Resolve the promise when login is successful
            } else {
                alert("Login failed. Please check your credentials.");
                // You could resolve with null or leave it unresolved for retry
            }
        };

        loginForm.appendChild(loginButton);
        userInterface.appendChild(loginScreen);
    });
}
