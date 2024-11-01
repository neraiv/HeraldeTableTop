from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import the CORS package
import requests
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Path to the file where spell data is stored
SPELLS_FILE = os.path.join(os.getcwd(), 'database/spells.json')
USERS_FILE = os.path.join(os.getcwd(), 'database/users.json')
SERVER_INFO = os.path.join(os.getcwd(), 'database/server_info.json')

# Ensure spells file exists
if not os.path.exists(SPELLS_FILE):
    with open(SPELLS_FILE, 'w') as f:
        json.dump({}, f)  # Create an empty dictionary to start with

if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w') as f:
        json.dump({}, f)  # Create an empty dictionary to start with



@app.route('/getUser', methods=['GET'])
def get_user():
    try:
        user_id = request.args.get('user_id')
        password = request.args.get('password')  # Assuming password is passed as a query parameter
        if not user_id:
            return jsonify({"error": "user_id not provided"}), 400

        # Load the user data from the file
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r') as file:
                users_data = json.load(file)
        else:
            users_data = {}

        # Check if the user exists and matches password if provided
        user = users_data.get(user_id)
        if user and (user["password"] == password):
            # Update last_sync to current time
            user["last_sync"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
            user["status"] = "online"

            # Save updated last_sync and status back to the file
            with open(USERS_FILE, 'w') as file:
                json.dump(users_data, file, indent=4)

            game_user = {
                "user_id": user_id,
                "status": user["status"],
                "type": user["type"],
                "character": user["character"],
                "last_sync": user["last_sync"]
            }
            return jsonify(game_user)

        elif not user and len(password) >= 5:
            # Create a new user with default values
            new_user = {
                "password": password,
                "status": "online",
                "type": "adventurer",  # Default type
                "character": "unknown",  # Default character
                "last_sync": datetime.utcnow().isoformat()
            }
            users_data[user_id] = new_user

            # Save the new user to the file
            with open(USERS_FILE, 'w') as file:
                json.dump(users_data, file, indent=4)

            game_user = {
                "user_id": user_id,
                "status": "online",
                "type": "adventurer",
                "character": "unknown",
                "last_sync": new_user["last_sync"]
            }
            return jsonify(game_user)

        else:
            return jsonify({"error": "Invalid user_id or password."}), 400

    except FileNotFoundError:
        return jsonify({"error": "Users file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding JSON."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Route to get the spells data
@app.route('/avaliableSpells', methods=['GET'])
def get_spells():
    try:
        with open(SPELLS_FILE, 'r') as file:
            spells_data = json.load(file)

        # Transform the data into the desired format
        list_spells = {key: list(spells_data[key].keys()) for key in spells_data}

        return jsonify(list_spells)

    except FileNotFoundError:
        return jsonify({"error": "Spells file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding JSON."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to save the spells data
@app.route('/saveSpells', methods=['POST'])
def save_spells():
    try:
        data = request.get_json()  # Expecting JSON data from the request
        with open(SPELLS_FILE, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({"message": "Spells saved successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/getSpell/<int:spellLevel>/<string:spellName>', methods=['GET'])
def get_spell(spellLevel, spellName):
    try:
        with open(SPELLS_FILE, 'r') as file:
            spells_data = json.load(file)

        print(spells_data)
        # Check if the specified level exists and if the spell exists at that level
        if str(spellLevel) in spells_data and spellName in spells_data[str(spellLevel)]:
            spell = spells_data[str(spellLevel)][spellName]
            return jsonify(spell)  # Return the spell data as JSON
        else:
            return jsonify({"error": "Spell not found."}), 404

    except FileNotFoundError:
        return jsonify({"error": "Spells file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding JSON."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to get server information
@app.route('/getServerInfo', methods=['GET'])
def get_server_info():
    try:
        # Load the server info from the JSON file
        if os.path.exists(SERVER_INFO):
            with open(SERVER_INFO, 'r') as file:
                server_info = json.load(file)
                
            return jsonify(server_info), 200
        else:
            return jsonify({"error": "Server info file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding server info JSON."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Route to update server information
@app.route('/updateServerInfo', methods=['POST'])
def update_server_info():
    try:
        # Load the existing server info
        if os.path.exists(SERVER_INFO):
            with open(SERVER_INFO, 'r') as file:
                server_info = json.load(file)
        else:
            return jsonify({"error": "Server info file not found."}), 404

        data = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400

        # Log the received data for debugging
        print("Received data:", data)

        # Update the necessary fields in the server_info
        for key in ["server_time", "objectPositions", "listEnemies", "listAllies", "listNPC", "inGameChars"]:
            if key in data:
                server_info[key] = data[key]

        # Save the updated server info back to the file
        with open(SERVER_INFO, 'w') as file:
            json.dump(server_info, file, indent=4)

        return jsonify({"message": "Server info updated successfully!"}), 200

    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding JSON."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/game')
def home():
    return render_template('index.html')  # Render the HTML file

@app.route('/register_game', methods=['POST'])
def register_game():
    # Get game data from the request
    game_id = request.json.get('gameId')
    host_ip = request.json.get('hostIp')

    if not game_id or not host_ip:
        return jsonify({"success": False, "message": "Game ID and Host IP are required."}), 400

    # URL to your PHP script on InfinityFree
    url = 'https://heraldednd.wuaze.com/register_game.php'  # Update this with your actual URL

    # Prepare the data to send to the PHP script
    data = {
        'gameId': game_id,
        'hostIp': host_ip
    }

    try:
        # Send POST request to the PHP script using requests.post
        response = requests.post(url, data=data)

        # Return the JSON response from the PHP script
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:  # Correctly handling requests exceptions
        return jsonify({"success": False, "message": str(e)}), 500
    
def run_register_game():
    # You can modify this function to include necessary data for registration
    # Example static data; replace with dynamic data as needed
    game_data = {
        'gameId': 'example_game_id',  # Replace with actual game ID
        'hostIp': '192.168.1.2'        # Replace with actual host IP
    }

    # Simulate a POST request to register the game
    with app.test_request_context('/register_game', method='POST', json=game_data):
        register_game()

# Run the registration function when starting the server
if __name__ == '__main__':
    run_register_game()  # Call the function here to register the game at startup
    app.run(host='0.0.0.0', port=5000, debug=True)
