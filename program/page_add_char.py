from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import QStandardItemModel, QStandardItem
import os
import shutil

from program.ui.Ui_page_add_char import Ui_PageAddChar


class PageAddChar(QWidget):
    charaterSave = pyqtSignal(dict)
    
    def __init__(self, parent=None):
        super().__init__()
        self.ui = Ui_PageAddChar()
        self.ui.setupUi(self)
        
        self.connect_buttons()
        
    def connect_buttons(self):
        self.ui.pushButton_save.clicked.connect(self.save)
        
    def save(self):
        char_name = self.ui.lineEdit_charName.text().strip()  # Get character name
        
        if not char_name:
            print("Character name is empty")
            return
        
        char_name = char_name.replace(' ', '_')
           
        image_path = getattr(self.ui.label_charImage, "image_path", None)
        
        self.charaterSave.emit(
            {
                "type": "local",
                "name": char_name,
                "image_path": image_path 
            }
        )         
            
        
            
        