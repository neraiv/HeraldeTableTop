# singleton_class.py

class Singleton:
    _instance = None  # Private class attribute to hold the instance

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
            # You can add initialization logic here if needed, but typically in __init__
            print("Singleton instance created for the first time.")
        return cls._instance

    def __init__(self):
        # Initialization logic for the singleton instance (will only run once)
        print("Singleton __init__ method called (only once).")
        self.value = "Initial Value"

    def get_value(self):
        return self.value

    def set_value(self, new_value):
        self.value = new_value
        print(f"Singleton value updated to: {self.value}")

    def do_something(self):
        return "Singleton is doing something useful."