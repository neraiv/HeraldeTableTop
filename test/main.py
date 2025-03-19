# main.py
from singleton_class import Singleton
from access_1 import access_singleton_from_1
from access_2 import access_singleton_from_2

def main():
    print("Starting main program...")

    # Get Singleton instance in main.py
    main_instance = Singleton()
    print(f"Main: Instance ID = {id(main_instance)}")
    print(f"Main: Initial Value = {main_instance.get_value()}")
    main_instance.set_value("Value from Main")
    print(f"Main: Updated Value = {main_instance.get_value()}")
    print(f"Main: {main_instance.do_something()}")

    print("\nAccessing Singleton from access_1.py:")
    instance_1 = access_singleton_from_1()

    print("\nAccessing Singleton from access_2.py:")
    instance_2 = access_singleton_from_2()

    print("\nChecking if all instances are the same:")
    if main_instance is instance_1 is instance_2:
        print("Yes, all instances are the same. Singleton pattern is working!")
        print(f"Final Value (through main_instance): {main_instance.get_value()}")
    else:
        print("No, instances are different. Singleton pattern might not be working.")

if __name__ == "__main__":
    main()