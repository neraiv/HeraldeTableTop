
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS  # Import the CORS package
import json
import os

from import_db_files import *
from db_handler import wait_until_file_is_closed

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the on_exit function


@app.route('/avaliableSpells', methods=['GET'])
def get_available_spells():
    try:
        wait_until_file_is_closed(SPELLS)
        with open(SPELLS, 'r') as file:
            spells_data = json.load(file)

        # Transform the data into the desired format
        list_spells = {key: list(spells_data[key].keys()) for key in spells_data}

        return jsonify(list_spells)

    except FileNotFoundError:
        return jsonify({"error": "Spells file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/saveSpells', methods=['POST'])
def save_all_spells():
    try:
        data = request.get_json()  # Expecting JSON data from the request
        wait_until_file_is_closed(SPELLS)
        with open(SPELLS, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({"message": "Spells saved successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/getSpell/<int:spellLevel>/<string:spellName>', methods=['GET'])
def get_spell_data(spellLevel, spellName):
    try:
        wait_until_file_is_closed(SPELLS)
        with open(SPELLS, 'r') as file:
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
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/getServerInfo', methods=['GET'])
def get_server_info():
    try:
        # Load the server info from the JSON file
        if os.path.exists(SERVER_INFO):
            wait_until_file_is_closed(SERVER_INFO)
            with open(SERVER_INFO, 'r') as file:
                server_info = json.load(file)
                
            return jsonify(server_info), 200
        else:
            return jsonify({"error": "Server info file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding server info JSON."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/updateServerInfo', methods=['POST'])
def update_server_info():
    try:
        # Load the existing server info
        if os.path.exists(SERVER_INFO):
            wait_until_file_is_closed(SERVER_INFO)
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
        wait_until_file_is_closed(SERVER_INFO)
        with open(SERVER_INFO, 'w') as file:
            json.dump(server_info, file, indent=4)

        return jsonify({"message": "Server info updated successfully!"}), 200

    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')  # Renamed this route
def home():
    return render_template('index.html')  # Render the HTML file

@app.route('/getUser', methods=['GET'])
def get_user():
    try:
        user_id = request.args.get('user_id')
        password = request.args.get('password')  # Assuming password is passed as a query parameter
        if not user_id:
            return jsonify({"error": "user_id not provided"}), 400

        # Load the user data from the file
        if os.path.exists(USERS):
            wait_until_file_is_closed(USERS)
            with open(USERS, 'r') as file:
                users_data = json.load(file)
        else:
            users_data = {}

        # Check if the user exists and matches password if provided
        user = users_data.get(user_id)
        if user and (user["password"] == password):
            if user["status"] == "offline":
                # Update last_sync to current time
                user["last_sync"] = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
                user["status"] = "online"

                # Save updated last_sync and status back to the file
                wait_until_file_is_closed(USERS)
                with open(USERS, 'w') as file:
                    json.dump(users_data, file, indent=4)

                game_user = {
                    "user_id": user_id,
                    "status": user["status"],
                    "type": user["type"],
                    "character": user["character"],
                    "last_sync": user["last_sync"],
                    "game_save_number": user["game_save_number"]
                }
                return jsonify(game_user)
            else:
                return jsonify({"error": "User is already online."}), 400
        else:
            return jsonify({"error": "Invalid user_id or password."}), 400

    except FileNotFoundError:
        return jsonify({"error": "Users file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/userSync', methods=['GET'])
def user_sync():
    try:
        user_id = request.args.get('user_id')
        password = request.args.get('password')  # Assuming password is passed as a query parameter
        if not user_id:
            return jsonify({"error": "user_id not provided"}), 400

        # Load the user data from the file
        if os.path.exists(USERS):
            wait_until_file_is_closed(USERS)
            with open(USERS, 'r') as file:
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
            wait_until_file_is_closed(USERS)
            with open(USERS, 'w') as file:
                json.dump(users_data, file, indent=4)

            if os.path.exists(SERVER_INFO):
                wait_until_file_is_closed(SERVER_INFO)
                with open(SERVER_INFO, 'r') as file:
                    server_data = json.load(file)
            else:
                raise FileNotFoundError("SERVER_INFO file does not exist")


            if server_data:
                user_game_save_number = int(user["game_save_number"])  # Convert to int
                server_game_save_number = int(server_data["game_save_number"])  # Convert to int

                if user_game_save_number != server_game_save_number:
                    update_status = "true"
                else:
                    update_status = "false"
                

            return jsonify({"message": "User Synced", "update_status": update_status}), 200
        else:
            return jsonify({"error": "Invalid user_id or password."}), 400

    except FileNotFoundError:
        return jsonify({"error": "Users file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

@app.route('/getPaths')
def get_images_list():
    try:
        user_id = request.args.get('user_id')
        password = request.args.get('password')  # Assuming password is passed as a query parameter
        if not user_id:
            return jsonify({"error": "user_id not provided"}), 400

        # Load the user data from the file
        if os.path.exists(USERS):
            wait_until_file_is_closed(USERS)
            with open(USERS, 'r') as file:
                users_data = json.load(file)
        else:
            users_data = {}

        # Check if the user exists and matches password if provided
        user = users_data.get(user_id)
        if user and (user["password"] == password):
            # Update last_sync to current time

            wait_until_file_is_closed(IMAGES)
            with open(IMAGES, 'r') as file:
                data = json.load(file)

            # Extract the character list from the 'character' section
            class_icons     = list(data.get("class-icons", {}).keys())
            character_list  = list(data.get("character", {}).keys())
            background_list = list(data.get("background"))
            general_sounds_list = list(data.get("general-sounds", {}).keys())
            menu_icons = list(data.get("menu-icons", {}).keys())

            if os.path.exists(SERVER_INFO):
                wait_until_file_is_closed(SERVER_INFO)
                with open(SERVER_INFO, 'r') as file:
                    server_data = json.load(file)
            else:
                raise FileNotFoundError("SERVER_INFO file does not exist")
            
            user["game_save_number"] = int(server_data["game_save_number"])  # Convert to int

                        # Save updated last_sync and status back to the file
            wait_until_file_is_closed(USERS)
            with open(USERS, 'w') as file:
                json.dump(users_data, file, indent=4)

            return jsonify({
                "class_icons":     class_icons,
                "character_list":  character_list,
                "background_list": background_list,
                "general_sounds_list": general_sounds_list,
                "menu_icons": menu_icons
            })
        else:
            return jsonify({"error": "Invalid user_id or password."}), 400

    except FileNotFoundError:
        return jsonify({"error": "Spells file not found."}), 404
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
