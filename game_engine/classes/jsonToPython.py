import json
import inspect
from typing import Type, Any


class JSONHandler:
    """
    A utility class for handling JSON serialization and deserialization for any class.
    """
    @staticmethod
    def from_json(cls: Type[Any], json_data: dict) -> Any:
        """
        Deserialize a JSON dictionary to an instance of the provided class.
        Attributes defined in the class constructor are explicitly initialized,
        and extra attributes are added dynamically.

        :param cls: The class to create an instance of
        :param json_data: The JSON data as a dictionary
        :return: An instance of the class
        """
        # Get constructor parameter names
        constructor_params = inspect.signature(cls).parameters
        init_args = {key: json_data.get(key, None) for key in constructor_params}

        # Create an instance of the class
        instance = cls(**init_args)

        # Add extra attributes dynamically
        for key, value in json_data.items():
            if key not in constructor_params:
                setattr(instance, key, value)

        return instance

    @staticmethod
    def to_json(instance: Any) -> dict:
        """
        Serialize an instance of a class to a JSON dictionary.
        """
        if not hasattr(instance, '__dict__'):
            raise TypeError(f"Expected a class instance, got {type(instance).__name__}")

        # Convert all attributes to a JSON-serializable dictionary
        return {
            key: JSONHandler._convert_to_json_serializable(value)
            for key, value in instance.__dict__.items()
    }

    @staticmethod
    def _convert_to_json_serializable(value: Any) -> Any:
        """
        Convert non-serializable objects to a JSON-serializable format.
        """
        if isinstance(value, list):
            return [JSONHandler._convert_to_json_serializable(v) for v in value]
        elif isinstance(value, dict):
            return {k: JSONHandler._convert_to_json_serializable(v) for k, v in value.items()}
        elif hasattr(value, '__dict__'):  # If it's another custom class
            return JSONHandler.to_json(value)
        else:  # If it's a primitive type or already serializable
            return value

    @staticmethod
    def save_to_json_file(instance: Any, filepath: str):
        """
        Save an instance to a JSON file.

        :param instance: The class instance
        :param filepath: The path to save the JSON file
        """
        with open(filepath, 'w') as file:
            json.dump(JSONHandler.to_json(instance), file, indent=4)

    @staticmethod
    def load_from_json_file(cls: Type[Any], filepath: str) -> Any:
        """
        Load JSON data from a file and deserialize it into an instance of the class.

        :param cls: The class to create an instance of
        :param filepath: The JSON file path
        :return: An instance of the class
        """
        with open(filepath, 'r') as file:
            json_data = json.load(file)
        return JSONHandler.from_json(cls, json_data)
    


