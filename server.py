
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS  # Import the CORS package
import json
import os
from import_db_files import *
from db_handler import wait_until_file_is_closed, generate_key


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the on_exit function
def controlKey(key) -> dict:
    wait_until_file_is_closed(USERS)
    with open(USERS, 'r') as file:
        users_data: dict = json.load(file)
    
    char = {}
    # Check if the provided key exists for an online user
    for username in users_data.keys():
        user = users_data[username]
        if user['key'] == key and user['status'] == 'online':
            return user
    return None

@app.route('/debug')  # Renamed this route
def debug():
    return render_template('debug_game.html')  # Render the HTML file

@app.route('/login')  # Renamed this route
def home():
    return render_template('debug_login.html')  # Render the HTML file
    
@app.route('/game/<string:key>')  # Route with parameters
def game(key):
    return openGamePage(key)

@app.route('/requestLogin', methods=['POST'])
def login():
    return login_func()

@app.route('/getChar', methods=['POST'])
def getChar():
    return getChar_func()

@app.route('/registerChar', methods=['POST'])
def registerChar():
    return registerChar_func()

def registerChar_func():
    try:
        data: dict = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400
        
        key = data.get('key')
    
        if not key:
            return jsonify({"error": "Key is not provided."}), 400
        
        user = controlKey(key)

        if user:
            
            if user.get("character") == "":
                wait_until_file_is_closed(CHARS)
                with open(CHARS, 'r') as file:
                    all_chars: dict = json.load(file)
                
                char = data["char"]
                char_name = char["name"]
                all_chars[char_name] = char

                wait_until_file_is_closed(CHARS)
                with open(CHARS, 'w') as file:
                    json.dump(all_chars, file)
                
                return jsonify({"success": "Character registered.", "char_name": char_name}), 200
            else:
                return jsonify({"error": "Character already registered."}), 400
            

            
            return jsonify({"success": "Character registered.", "char_name": char_name}), 200
        else:
            return jsonify({"error": "User not found or not online."}), 404
        
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def getChar_func():
    try:
        data: dict = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400
        
        key = data.get("key")

        if not key:
            return jsonify({"error": "Key is not provided."}), 400
        
        user = controlKey(key)

        if user:
            wait_until_file_is_closed(CHARS)
            with open(CHARS, 'r') as file:
                all_chars: dict = json.load(file)
            
            char = all_chars.get(user['character'])

            return jsonify({"success": "Character data retrieved.", "char": char}), 200
        else:
            return jsonify({"error": "User not found or not online."}), 404
        
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def openGamePage(key):
    try:
        if not key:
            return jsonify({"error": "Key or username not provided."}), 400
        
        user = controlKey(key)
        
        if user:
            if user['type'] == "dungeon_master":
                return jsonify({"success": "Opening dungeon master page."}), 200
            elif user['type'] == "adventurer":
                return render_template('debug_game.html')  # Render the HTML file
        else:
            return render_template("debug_login.html")

    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def login_func():
    try:

        data: dict = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400
        username = data.get('username')
        password = data.get('password')

        # Load the user data from the file
        if os.path.exists(USERS):
            wait_until_file_is_closed(USERS)
            with open(USERS, 'r') as file:     
                users_data: dict = json.load(file)

        if users_data == {}:
            return jsonify({"error": "No user data found on server."}), 404
        
        # Check if the user exists and matches password if provided
        user = users_data.get(username)
        if user and (user["password"] == password):
            if user["status"] == "offline":       
                # Update last_sync to current time
                user["last_sync"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
                user["key"] = generate_key()
                user["status"] = "online"

                # Save updated last_sync and status back to the file
                wait_until_file_is_closed(USERS)
                with open(USERS, 'w') as file:
                    json.dump(users_data, file, indent=4)

                return jsonify({"success": "Successfully logged in as " + user["type"], "url": user["key"]}), 200
            else:
                return jsonify({"error": "User is already logged in."})
        else:
            return jsonify({"error": "Invalid user_id or password."}), 400
            
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)