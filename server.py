
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS  # Import the CORS package
import json
import os
import atexit

from import_db_files import *
from db_handler import *

DEBUG_MODE = False

db = DBHandeler(os.path.join(DB_MAIN_PATH, 'database', 'chat.csv'))

sync_thread = threading.Thread(target=db.start_sync_timer, daemon=True)
sync_thread.start()

atexit.register(db.on_exit)
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the on_exit function
def controlKey(key) -> tuple[str, dict]:
    db.wait_until_file_is_closed(USERS)
    with open(USERS, 'r') as file:
        users_data: dict = json.load(file)
    
    char = {}
    # Check if the provided key exists for an online user
    for username in users_data.keys():
        user = users_data[username]
        if user['key'] == key and user['status'] == 'online':
            return username, user
    return None, None

@app.route('/')  # Renamed this route
def home():
    return render_template('debug_login.html')  # Render the HTML file

@app.route('/debug')  # Renamed this route
def debug():
    return render_template('debug_game.html')  # Render the HTML file
   
@app.route('/getSession', methods=['GET'])  # Route with parameters
def getSession():
    return getSession_func()

@app.route('/game')  # Route with parameters
def game():
    key = request.args.get('key')  # Assuming key is passed as a query parameter
    return openGamePage(key)

@app.route('/requestLogin', methods=['POST'])
def login():
    return login_func()

@app.route('/getGameInfo', methods=['GET'])
def getGameInfo():
    return getGameInfo_func()

@app.route('/getChat', methods=['GET'])
def getChat():
    return getChat_func()

@app.route('/sendMessage', methods=['POST'])
def sendMessage():
    return sendMessage_func()

@app.route('/getChar', methods=['GET'])
def getChar():
    return getChar_func()

@app.route('/registerChar', methods=['POST'])
def registerChar():
    return registerChar_func()

def getGameFile(name, from_session = True):
    db.wait_until_file_is_closed(SERVER_INFO)
    with open(SERVER_INFO, 'r') as file:
        server_info = json.load(file)
        #FUTURE LAST SESSİON VARMI YOKMU BAKILMASI LAZIM
    last_session = server_info["last_session"]

    path = ""
    if from_session:
        path = os.path.join(GAMES_PATH, last_session, name)
    else:
        path = os.path.join(DB_MAIN_PATH,"database", name)

    with open(path, 'r') as file:
        return json.load(file)

def templeteGetFunc():
    try:
        key = request.args.get('key')  # Extract 'key' from query parameters

        if not key and not DEBUG_MODE:
            return jsonify({"error": "Key is not provided."}), 400
        
        if not DEBUG_MODE:
            user = controlKey(key)[0]

        if user or DEBUG_MODE:
            # Here
            pass
            # --------------------------------------------------
        else:
            return jsonify({"error": "User not found or not online."}), 404
        
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def getSession_func():
    try:
        key = request.args.get('key')  # Extract 'key' from query parameters

        if not key and not DEBUG_MODE:
            return jsonify({"error": "Key is not provided."}), 400
        
        if not DEBUG_MODE:
            user = controlKey(key)[0]

        if user or DEBUG_MODE:
            session_data: dict = getGameFile("session_info.json")
            
            # Get the current scene
            currentSceneName = session_data["currentScene"]["name"]
            scenes_data = getGameFile("scenes.json")
            currentSceneData = scenes_data[currentSceneName]
                        
            if session_data and currentSceneData:
                return jsonify({"success": "200", "session": session_data, "scene": currentSceneData}), 200
            else:
                # FUTURE Find what is missing?   
                return jsonify({"error": "Something is missing in session."}), 404
        else:
            return jsonify({"error": "User not found or not online."}), 404
        
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500



def sendMessage_func():
    try:

        data: dict = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400
        key = data.get('key')
        message = data.get('message')

        if not key and not DEBUG_MODE:
            return jsonify({"error": "Key is not provided."}), 400
        
        if not DEBUG_MODE:
            username = controlKey(key)[0]

        if username or DEBUG_MODE:
            try:
                db.addMessage(username, message)
                return jsonify({"success": "Message sent successfully."})
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        else:
            return jsonify({"error": "User not found or not online."}), 404        
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def getChat_func():
    try:
        key = request.args.get('key')  # Extract 'key' from query parameters
        idx = int(request.args.get('idx'))  # Extract 'info' from query parameters
        len = int(request.args.get('len')) # Extract

        if not key or not idx or not len and not DEBUG_MODE:
            return jsonify({"error": "Key is not provided."}), 400
        
        print(len, idx , request.args.get('len'), request.args.get('idx'))
            
        if not DEBUG_MODE:
            user = controlKey(key)[0]

        if user or DEBUG_MODE:
            chat_data = db.getMessages(idx, len)
            print(chat_data)
            if chat_data:
                return jsonify({"success": "Successfully got game info file.", "data": chat_data}) 
            else:
                return jsonify({"error": "Game info not found."}), 404
        else:
            return jsonify({"error": "User not found or not online."}), 404
        
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def getGameInfo_func():
    try:
        key = request.args.get('key')  # Extract 'key' from query parameters
        info = request.args.get('info')  # Extract 'info' from query parameters
        state = request.args.get('state') # Extract 'state' from query

        if not key or not info or not state and not DEBUG_MODE:
            return jsonify({"error": "Missing data"}), 400
        
        if state  == "true":
            state = True
        elif state == "false":
            state = False

        if not DEBUG_MODE:
            user = controlKey(key)[0]

        if user or DEBUG_MODE:
            db_data = getGameFile(info, state)
            if db_data:
                return jsonify({"success": "Successfully got game info file.", "data": db_data}) 
            else:
                return jsonify({"error": "Game info not found."}), 404
        else:
            return jsonify({"error": "User not found or not online."}), 404
        
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def registerChar_func():
    try:
        data: dict = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400
        
        key = data.get('key')
    
        if not key:
            return jsonify({"error": "Key is not provided."}), 400
        
        user = controlKey(key)[1]

        if user:
            
            if user.get("character") == "":
                db.wait_until_file_is_closed(CHARS)
                with open(CHARS, 'r') as file:
                    all_chars: dict = json.load(file)
                
                char = data["char"]
                char_name = char["name"]
                all_chars[char_name] = char

                db.wait_until_file_is_closed(CHARS)
                with open(CHARS, 'w') as file:
                    json.dump(all_chars, file)
                
                return jsonify({"success": "Character registered.", "char_name": char_name}), 200
            else:
                return jsonify({"error": "Character already registered."}), 400
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
        key = request.args.get('key')  # Extract 'key' from query parameters
        char_name = request.args.get('char')  # Extract 'info' from query parameters

        if not key:
            return jsonify({"error": "Key is not provided."}), 400
        
        user = controlKey(key)[0]

        if user:
            
            all_chars: dict = getGameFile("chars.json")
            
            char = all_chars.get(char_name)

            if char:
                return jsonify({"success": "Character data retrieved.", "char": char}), 200
            else:
                return jsonify({"error": "Character not found."}), 200
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
        
        user = controlKey(key)[1]
        
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
            db.wait_until_file_is_closed(USERS)
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
                user["key"] = db.generate_key()
                user["status"] = "online"

                # Save updated last_sync and status back to the file
                db.wait_until_file_is_closed(USERS)
                with open(USERS, 'w') as file:
                    json.dump(users_data, file, indent=4)

                return jsonify({"success": "Successfully logged in as " + user["type"], "key": user["key"]}), 200
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