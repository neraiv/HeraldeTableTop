import pandas as pd
from datetime import datetime, timezone

class ChatHandler:
    def __init__(self, file_path):
        """
        Initialize the ChatHandler with the path to the CSV file.
        :param file_path: Path to the CSV file.
        """
        self.file_path = file_path
        self.updated = True
        self.last_idx = 0
        
        # Ensure the file exists with the required columns
        try:
            df = pd.read_csv(self.file_path, sep=";")
            if not df.empty:
                # Get the highest index value from the file
                self.last_idx = len(df) -1
        except FileNotFoundError:
            # Create an empty CSV file with appropriate headers
            pd.DataFrame(columns=["idx", "timestamp", "user", "message"]).to_csv(
                self.file_path, sep=";", index=False
            )

    def addMessage(self, user, message):
        """
        Append a message to the chat file.
        :param user: The username of the sender.
        :param message: The message content.
        """
        # Get the current timestamp in the desired format
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M %Z")
        
        try:
            # Read the existing chat file to get the current index
            df = pd.read_csv(self.file_path, sep=";")
            idx = len(df)
        except FileNotFoundError:
            # If the file doesn't exist, start the index from 0
            idx = 0

        # Create a new message as a DataFrame
        new_message = pd.DataFrame([{
            "idx": idx,
            "timestamp": timestamp,
            "user": user,
            "message": message
        }])
        
        self.updated = True
        self.last_idx = idx

        # Append the new message to the file
        new_message.to_csv(self.file_path, sep=";", mode='a', header=not bool(idx), index=False)

    def getMessages(self, start_idx, length):
        """
        Retrieve messages from the chat file, starting from the end.
        :param start_idx: Reverse start index (0 for the last message, 1 for the second last, etc.).
        :param length: Number of messages to fetch.
        :return: A list of messages (each as a dictionary).
        """
        try:
            df = pd.read_csv(self.file_path, sep=";")

            # Get the subset of messages
            df_subset = df.iloc[start_idx-length:start_idx + 1]
            return df_subset.to_dict(orient="records")
        except FileNotFoundError:
            return []  # Return an empty list if the file does not exist
