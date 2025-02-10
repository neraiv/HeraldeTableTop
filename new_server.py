
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS  # Import the CORS package
from flask_socketio import SocketIO, send, emit
import json
import os
import atexit

from db_handler import DBHandeler, TypeRules
from key_handeler import controlKey


db = DBHandeler()

app = Flask(__name__)
app.secret_key = "48c80162841c766a3bee0d888fdaeacb4e6f1792710d34e0"
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('request')
def handle_message(msg :dict):
    print("Reusts taken" , msg)
    
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
        username = request.args.get('username') 
        password = request.args.get('password')
        
        if  username and password:
            newKey, charId = db.userLogin() 
            if newKey and charId:
                return jsonify({"success": "Login successful.", "key": newKey, "charId": charId}), 200
            else:
                return jsonify({"error": "Invalid username or password"}), 401
        else:
            return jsonify({"error": "Missing username or password"}), 400       
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/getSession', methods=['GET'])
def getSession():
    try:
        key = request.args.get('key')  # Extract 'key' from query parameters
      
        username, char = db.controlKey(key)
        
        if username and char:
            db.handle_request()
    except json.JSONDecodeError:
        return jsonify({
            "error": f"Error decoding JSON in function {__name__}"
        }), 500
            