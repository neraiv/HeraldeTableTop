# access_1.py
from singleton_class import Singleton

def access_singleton_from_1():
    instance = Singleton()
    print(f"Access 1: Instance ID = {id(instance)}")
    print(f"Access 1: Initial Value = {instance.get_value()}")
    instance.set_value("Value from Access 1")
    print(f"Access 1: Updated Value = {instance.get_value()}")
    print(f"Access 1: {instance.do_something()}")
    return instance

if __name__ == "__main__":
    access_singleton_from_1()