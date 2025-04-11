from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import QStandardItemModel, QStandardItem

from program.ui.Ui_program import Ui_MainWindow
from program.page_add_char import PageAddChar

import threading
import sys
import time
from _server import app, socketio, db, DBHandeler


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        
        self.widgetAddChar  = PageAddChar(self)
        
        self.serverThread = None  # Keep track of the server thread
        
        self.connect_buttons()
        
    def connect_buttons(self):
        self.ui.pushButton_databaseAddChar.clicked.connect(self.display_add_char)
        
        self.ui.pushButton_serverStart.clicked.connect(self.slot_pushButton_serverStart)
        self.ui.pushButton_serverStop.clicked.connect(self.slot_pushButton_serverStop)
        
        self.widgetAddChar.charaterSave.connect(db.fileManagement_saveCharacter)
        
    def display_add_char(self):
        self.widgetAddChar.show()
        
    def server_thread(self):
        try:
            socketio.run(app, host='0.0.0.0', port=5000, use_reloader=False)
        except Exception as e:
            print(f"Server runtime error: {str(e)}, trying to restart server in 3s...")
            time.sleep(3)
        
    def slot_pushButton_serverStart(self):
        """Starts the Flask server in a separate thread."""
        # Run the Flask-SocketIO server
        try:
            self.serverThread = threading.Thread(target=self.server_thread)
            self.serverThread.start()
        except Exception as e:
            print(f"Error starting server: {str(e)}")
        
        self.ui.pushButton_serverStart.setEnabled(False)
        print("Server started.")
        
    def slot_pushButton_serverStop(self):
        """Stops the Flask server (Flask-SocketIO has no built-in stop function)."""
        # Send a shutdown signal to the server thread
        socketio.emit('shutdown', {'msg': 'Shutting down...'})
        self.serverThread.join()  # Wait for the server thread to finish before exiting the program
        
        self.serverThread = None  # Reset the server thread variable
        self.ui.pushButton_serverStart.setEnabled(True)
        print("Server stop requested.")
        

if __name__ == "__main__":
    qt_app = QApplication(sys.argv)
    main_window = MainWindow()
    main_window.show()
    sys.exit(qt_app.exec_())
    
    