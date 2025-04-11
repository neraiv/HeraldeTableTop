// Handle game join button clic

let urlParams = null

const loginButton = document.getElementById('login-button')
const gameButton = document.getElementById('enter-button')
const editorButton = document.getElementById('editor-button')

const userName = document.getElementById('username')
const password = document.getElementById('password')
const serverKey = document.getElementById('server-key')

let userData = {}

function sendLoginRequest(){
    fetch(
        "http://127.0.0.1:5000/login",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userName.value,
                password: password.value,
            }),
        }
    ).then(response =>
        response.json()
    ).then(data => {
        console.log(data);
        if(data.error){
            alert('Login failed: '+ data.error);
        } else {
            userData = data;
            gameButton.style.display = "block"
            editorButton.style.display = "block"
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing the login.', error);
    });
}


loginButton.onclick = async (event) => {
    event.preventDefault(); // Prevent form submission
   sendLoginRequest() 
};

gameButton.onclick =  (event) =>{
    event.preventDefault();
    urlParams = new URLSearchParams();
    urlParams.set("game_id", serverKey.value);
    urlParams.set("userName", userName.value)
    urlParams.set("charId", userData.charId)
    urlParams.set("key", userData.key)
    window.location.href = "/game?" + urlParams.toString();  // Redirect to the game page with the game ID and user information
};

editorButton.onclick = (event) =>{
    event.preventDefault();
    urlParams = new URLSearchParams();
    urlParams.set("userName", userName.value)
    urlParams.set("key", userData.key)
    window.location.href = "/editor?" + urlParams.toString();  // Redirect to the editor page with the game ID and user information
};