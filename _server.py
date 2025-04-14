
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS  # Import the CORS package
from flask_socketio import SocketIO, send, emit
import json
import os
import atexit

from _db_handler import DBHandeler
from handler_keys import controlKey


db = DBHandeler()

app = Flask(__name__)
app.secret_key = "48c80162841c766a3bee0d888fdaeacb4e6f1792710d34e0"
CORS(app)  # Enable CORS for all routes

atexit.register(db.on_exit)

socketio = SocketIO(app, cors_allowed_origins="*")

connections = {}

@socketio.on('register')
def handle_register(msg :dict):
    try:
        key = msg["key"]
            
        userId, userInfo = db.controlKey(key)
        
        if userId and userInfo:
            connections[userId] = request.sid
            emit("response", {"success": True}, room=request.sid)
        else:
            emit("response", {"success": False, "error": "Invalid key."}, room=request.sid)
    except Exception as e:
        emit("response", {"success": False, "error": str(e)}, room=request.sid)
        
        
@socketio.on('request')
def handle_message(msg :dict):
    try:
        key = msg["key"]
        
        userId, userInfo = db.controlKey(key)
        
        if userId and userInfo:
            msg.pop("key")
            socket_reply, socket_update = db.socket_handler(msg, userId, userInfo)
            emit("response", socket_reply, room=request.sid)
            
            if socket_update:
                for item in socket_update:
                    isAllUsers = item["all_users"]
                    item.pop("all_users")
                    if isAllUsers:
                        emit("change", item)
                    else:
                        emit("change", item, room=request.sid)
            
    except json.JSONDecodeError:
        # Send back the response
        emit("error", jsonify({"error": f"Error decoding JSON in function {__name__}"}), room=request.sid)
    
@app.route('/')  # Renamed this route
def home():
    return render_template('debug_login.html')  # Render the HTML file

@app.route('/game')  # Route with parameters
def game():
    key = request.args.get('key')
    userName, user = db.controlKey(key)
    
    try:
        if userName and user:
            if user["type"] == "dungeon_master":
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
    
@app.route('/login', methods=['POST'])
def login():
    try:
        data: dict = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400
        
        username = data.get('username') 
        password = data.get('password')
        
        if  username and password:
            status, newKey, charId = db.userLogin(username, password) 
            if status == "ok":
                return jsonify({"success": True, "key": newKey, "charId": charId}), 200
            else:
                return jsonify({"error": status}), 200
        else:
            return jsonify({"error": "Missing username or password"}), 400       
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/getObjects', methods=['GET'])
def get_objects():
    # CONTROL KEY
    key = request.args.get('key')
    userId, userInfo = db.controlKey(key)
    
    if not userId and not userInfo:
        return jsonify({"error": "Invalid key."}), 401    
    return jsonify(get_objects_data())

@app.route('/getBackgrounds', methods=['GET'])
def get_background():
        # CONTROL KEY
    key = request.args.get('key')
    userId, userInfo = db.controlKey(key)
    
    if not userId and not userInfo:
        return jsonify({"error": "Invalid key."}), 401

    return jsonify(get_background_data())

@app.route('/getNpcs', methods=['GET'])
def get_npcs():
        # CONTROL KEY
    key = request.args.get('key')
    userId, userInfo = db.controlKey(key)
    
    if not userId and not userInfo:
        return jsonify({"error": "Invalid key."}), 401

    return jsonify(get_npcs_data())
            
@app.route('/editor')  # Route with parameters
def editor():
    return render_template('debug_editor.html')

@app.route('/map')  # Route to display the map
def map_view():
    # You can pass any map-related data here
    return render_template('map_view.html')  # Render the map in this view

@app.route("/saveCharacter", methods=["POST"])
def save_character():
    try:
        data: dict = request.get_json()
        if data is None:
            return jsonify({"error": "Invalid JSON data."}), 400
        charId = data.get("charId")
        if not charId:
            pass
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_background_data():
    backgrounds = {}

    try:
        # Iterate over directories in ROOT_DIR
        backgrounds_path = os.path.join(db.DB_MAIN_PATH, "static/images/background")
        for folder in os.listdir(backgrounds_path):
            folder_path = os.path.join(backgrounds_path, folder)

            if os.path.isdir(folder_path):
                background_data = {
                    "layers": {}
                }

                # Iterate over files inside the folder
                for file in os.listdir(folder_path):
                    file_path = os.path.join(folder_path, file)

                    # Identify ambiance (MP3 file)
                    if file.endswith(".mp3"):
                        background_data["ambiance"] = file
                    
                    # Identify image layers
                    elif file.endswith((".jpg", ".png", ".jpeg", ".webp")):
                        parts = file.split("_")
                        if len(parts) == 2 and parts[1].split(".")[0].isdigit():
                            layer_number = parts[1].split(".")[0]
                            layer_type = "dark" if "dark" in file.lower() else "light"

                            if layer_number not in background_data["layers"]:
                                background_data["layers"][layer_number] = {}

                            background_data["layers"][layer_number][layer_type] = file
                
                # Store structured data in the main dictionary
                backgrounds[folder] = background_data

        return backgrounds

    except Exception as e:
        return {"error": str(e)}

def get_objects_data():
    result = {}
    path = os.path.join(db.DB_MAIN_PATH,"static/images/objects")
    for root, dirs, files in os.walk(path):
        if root == path: continue
        # Extract folder name
        folder_name = os.path.basename(root)
        # Store files in the folder
        result[folder_name] = files
    return result

def get_npcs_data():
    try:
        result = {}
        path = os.path.join(db.DB_MAIN_PATH,"static/images/character")
        for root, dirs, files in os.walk(path):
            if root == path: continue
            # Extract folder name
            folder_name = os.path.basename(root)
            # Store files in the folder
            result[folder_name] = files
        return result
    except Exception as e:
        return jsonify({"error": str(e)}), 500

 
def main():
    socketio.run(app, host='127.0.0.1', port=5000, debug=True)

if __name__ == '__main__':
    main()
    
