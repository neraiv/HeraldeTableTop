from PyQt5.QtWidgets import QLabel
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt

class ImageDropLabel(QLabel):
    def __init__(self, parent=None):
        super().__init__(parent=parent)
        self.setText("Drop an image here")
        self.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.setStyleSheet("border: 2px dashed gray; padding: 10px;")
        self.setAcceptDrops(True)
        self.image_path = None  # Store the image path

    def dragEnterEvent(self, event):
        if event.mimeData().hasUrls():
            event.acceptProposedAction()

    def dropEvent(self, event):
        urls = event.mimeData().urls()
        if urls:
            self.image_path = urls[0].toLocalFile()  # Store the image path
            self.setPixmap(QPixmap(self.image_path).scaled(300, 300, Qt.AspectRatioMode.KeepAspectRatio))
