import json
import pandas as pd

"""
0;active;mounatainless_dwarf;25;26;"{""type"": ""attack_weapon"",""info"": {""source"": ""mounatainless_dwarf"", ""spell"": ""universe_smasher"", ""target"": ""char-faramir""}}"
1;active;env;-1;-1;"{""type"": ""additional_effect"",""info"": {""source"": ""Alchemy Shop-layer-2"", ""effect"": ""sickness"", ""target"": ""char""}}"
2;active;env;-1;-1;"{""type"": ""additional_effect"",""info"": {""source"": ""Alchemy Shop-layer-2"", ""effect"": ""inspriation_bonus"", ""target"": ""char""}}"
3;active;env;-1;-1;"{""type"": ""additional_effect"",""info"": {""source"": ""Alchemy Shop-layer-2"", ""effect"": ""slow"", ""target"": ""char""}}"
4;active;mounatainless_dwarf;25;30;"{""type"": ""additional_effect"",""info"": {""source"": null, ""effect"": ""poison"", ""target"": ""npc-sari""}}"
5;active;thief;25;26;"{""type"": ""move_char"",""info"": {type: ""random-50""}}"
6;active;ogre;25;26;"{""type"": ""move_char"",""info"": {type: ""random-50""}}"
7;active;faramir;5;27;"{""action"": ""require_roll"", ""info"": {""type"": ""luck"", ""val"": 20, ""pass"": ""action-1"", ""fail"": ""action-2""}}"
"""
class EventHandler():
    def __init__(self, current_turn, csv_file_path, function_pointers):
        """
        Initializes the EventHandler by reading the CSV file and parsing events.
        """
        self.path: str = csv_file_path
        self.events: pd.DataFrame = pd.DataFrame()  # Initialize an empty DataFrame
        self.current_turn = current_turn
        self.function_pointers = function_pointers
        self.readFile()
        
    def readFile(self):
        """
        Reads the CSV file into a DataFrame.

        This function reads the CSV file specified by the 'path' attribute into a pandas DataFrame.
        The CSV file is expected to be semicolon-separated. If an error occurs during the reading process,
        the function will print an error message and continue execution.

        Parameters:
        None

        Returns:
        None
        """
        try:
            self.events = pd.read_csv(self.path, delimiter=';')
        except Exception as e:
            print(f"Error reading CSV file: {e}")

            
    def syncFile(self):
        """
        Writes the current state of the events DataFrame to the CSV file.

        This function writes the current state of the 'events' DataFrame to the CSV file specified by the 'path' attribute.
        It uses pandas' `to_csv` method to write the DataFrame to the CSV file. The index column is not included in the output,
        and the CSV file is separated by semicolons.

        If an error occurs during the writing process, the function will print an error message and continue execution.

        Parameters:
        None

        Returns:
        None
        """
        try:
            self.events.to_csv(self.path, index=False, sep=';')
        except Exception as e:
            print(f"Error writing CSV file: {e}")

            
    def run(self):
        """
        Executes events whose end turn matches the current turn.

        This function increments the current turn by 1, retrieves all events that should be executed in the current turn,
        and executes them. It also handles infinite events by executing them regardless of their end turn.
        After executing the events, the updated event list is saved to the CSV file.

        Parameters:
        None

        Returns:
        None
        """
        self.current_turn += 1

        # Get all events that should be executed in the current turn
        current_turn_events = self.events[self.events['end'] == self.current_turn]
        # Get all infinite events
        infinite_events = self.events[self.events['end'] == -1]

        # Execute the events in the current turn
        for event in current_turn_events.itertuples(index=True):
            self._execute_event(event)
            # Remove the executed event from the DataFrame
            self.events.drop(event.Index, inplace=True)

        # Execute the infinite events
        for event in infinite_events.itertuples(index=False):
            self._execute_event(event)

        # Save the updated event list to the CSV file
        self.syncFile()

        
    def removeEvents(self, source):
        """
        Removes all events from the DataFrame where the 'source' matches the given value.

        This function filters the 'events' DataFrame to exclude any rows where the 'source' column matches the given 'source' value.
        After filtering, it updates the 'events' DataFrame with the filtered data and saves the updated data to the CSV file using the 'syncFile' method.

        Parameters:
        source (str): The value to match in the 'source' column. All events with a matching 'source' value will be removed.

        Returns:
        None
        """
        self.events = self.events[self.events['source'] != source]
        self.syncFile()  # Ensure the updated data is saved

        
        
    def addEvent(self, source, end, action: dict):
        """
        Adds a new event to the DataFrame.

        This function creates a new event dictionary with the given parameters and adds it to the 'events' DataFrame.
        It also prints the new event for debugging purposes and saves the updated DataFrame to the CSV file.

        Parameters:
        source (str): The source of the event. This is used to identify the originator of the event.
        end (int): The turn number when the event should end. If set to -1, the event will be considered infinite.
        action (dict): The action to be performed when the event is executed. This should be a dictionary containing the event type and any additional information required.

        Returns:
        None
        """
        new_event = pd.DataFrame([{
            "id": len(self.events),
            "status": "active",
            "source": source,
            "start": self.current_turn,
            "end": end,
            "action": json.dumps(action)
        }])

        print(new_event)  # Debugging output

        self.events = pd.concat([self.events, new_event], ignore_index=True)
        self.syncFile()


    def _execute_event(self, event: pd.DataFrame):
        """
        Placeholder for executing an event.
        """
        return
        action  = json.load(event.get("action"))
        
        type_ = action["type"]
        
        func = getattr(self.function_pointers, type_)
    
    

# Example usage
if __name__ == "__main__":
    import time 
    
    event_handler = EventHandler(5, r'C:\Users\yigit.sirin\OneDrive - NOKTA MUHENDISLIK A.S\Belgeler\Code\DB\database\games\session-1\events.csv')

    event_handler.addEvent("faramir", 27, {"action": "require_roll", "info": {"type": "luck", "val": 20, "pass": "action-1", "fail": "action-2"}})

    for turn in range(0, 31):
        event_handler.run()
        print(event_handler.current_turn)
        time.sleep(1)  # Simulate a delay for better performance in a real-world scenario