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
                # Check if the idx column starts from 1
                if df['idx'].iloc[0] != 1:
                    self._rewrite_indices(df)
                # Get the highest index value from the file
                self.last_idx = int(df['idx'].max())
        except FileNotFoundError:
            # Create an empty CSV file with appropriate headers
            pd.DataFrame(columns=["idx", "timestamp", "user", "message"]).to_csv(
                self.file_path, sep=";", index=False
            )

    def _rewrite_indices(self, df: pd.DataFrame):
        """
        Rewrite the indices in the DataFrame to start from 1.
        :param df: The DataFrame to rewrite.
        """
        df['idx'] = range(1, len(df) + 1)
        df.to_csv(self.file_path, sep=";", index=False)

    def addMessage(self, user, message, timestamp):
        """
        Append a message to the chat file.
        :param user: The username of the sender.
        :param message: The message content.
        """
        try:
            try:
                df = pd.read_csv(self.file_path, sep=";")
                idx = len(df) + 1
            except FileNotFoundError:
                idx = 1

            new_message = pd.DataFrame([{
                "idx": idx,
                "timestamp": timestamp,
                "user": user,
                "message": message
            }])

            new_message.to_csv(self.file_path, sep=";", mode='a', header=not bool(idx - 1), index=False)

            self.updated = True
            self.last_idx = int(idx)

            return "success"

        except Exception as e:
            return f"{str(e)}"

    def getMessages(self, start_idx, length):
        """
        Retrieve messages from the chat file, starting from the end.
        :param start_idx: Reverse start index (0 for the last message, 1 for the second last, etc.).
        :param length: Number of messages to fetch.
        :return: A dictionary containing "data" (list of messages) and "success" (boolean).
        """
        try:
            df = pd.read_csv(self.file_path, sep=";")

            # Calculate the reverse start index from the end
            
            start = max(len(df), start_idx)
            end = max(0 , start - length - 1)

            # Get the subset of messages from the end
            df_subset = df.iloc[end: start]

            out = {
                "data": df_subset.to_dict(orient="records"),
                "success": True
            }
            return out

        except Exception as e:
            return {"success": False, "error": str(e)}



if __name__ == "__main__":
    chat_handler = ChatHandler("database/chat.csv")
    chat_handler.addMessage("Alice", "Hello, world!")
    chat_handler.addMessage("Bob", "How are you?")
    messages = chat_handler.getMessages(1, 2)
    print(messages)  