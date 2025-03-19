# access_2.py
from singleton_class import Singleton

def access_singleton_from_2():
    instance = Singleton()
    print(f"Access 2: Instance ID = {id(instance)}")
    print(f"Access 2: Current Value = {instance.get_value()}") # Notice it reflects changes from access_1
    instance.set_value("Value from Access 2")
    print(f"Access 2: Updated Value = {instance.get_value()}")
    print(f"Access 2: {instance.do_something()}")
    return instance

if __name__ == "__main__":
    access_singleton_from_2()