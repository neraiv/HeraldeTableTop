const serverUrl = "http://localhost:5000/"

const socket = io(serverUrl);

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.warn('Disconnected:', reason);
});

async function sendRequest({ type, payload, timeout = 5000 }) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            new Error(`Request timed out after ${timeout}ms`);
            resolve({success: false})
        }, timeout);

        socket.emit("request", {
            key: user.key,
            type: type,
            payload: payload
        });

        socket.once("response", (data) => {
            clearTimeout(timeoutId);
            if(data.success === false) {
                console.log("Error Fetching Request: ", data)
            }
            resolve(data);
        });

        socket.once("error", (err) => {
            clearTimeout(timeoutId);
            console.error("Socket error:", err);
            reject(err);
        });
    });
}


async function fetchUrl(url){
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            return { success: false, error: `HTTP error! Status: ${response.status}` };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Failed to fetch backgrounds:", error);
        return { success: false, error: error.message };
    }
}
async function getBackgrounds() {
    return fetchUrl(`/getBackgrounds?key=${encodeURIComponent(user.key)}`)
}

async function getObjects() {
    return fetchUrl(`/getObjects?key=${encodeURIComponent(user.key)}`)
}

async function getNpcs() {
    return fetchUrl(`/getNpcs?key=${encodeURIComponent(user.key)}`)
}