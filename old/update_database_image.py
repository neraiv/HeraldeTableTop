import os
import json

def get_folder_tree(path):
    """
    This function takes a folder path and returns a dictionary structure
    representing the folder tree with filenames, structured for the images.json format.

    Args:
        path (str): The path to the folder.

    Returns:
        dict: A dictionary representing the folder tree in the required format.
    """
    folder_tree = {
        "class-icons": {},
        "character": {},
        "background": {},
        "general-sounds": {},
        "menu-icons": {},
    }

    # Walk through the directory tree
    for root, dirs, files in os.walk(path):
        # Get the folder relative to the root path
        folder_name = os.path.relpath(root, path)

        if 'class-icons' in folder_name:
            for file in files:
                name_key = os.path.splitext(file)[0]
                folder_tree["class-icons"][name_key] = file
        elif 'character' in folder_name:
            if folder_name != "character":
                character_name = os.path.basename(folder_name)
                if files:
                    folder_tree["character"][character_name] = files[0]
        elif 'background' in folder_name and folder_name != "background":
            background_name = os.path.basename(folder_name)

            # Initialize placeholders for each category in Program_BackgroundFilesHolder
            dark_files = []
            light_files = []
            map_files = []
            music_files = []

            # Categorize files based on keywords
            for file in files:
                if "dark" in file.lower():
                    dark_files.append(file)
                elif "light" in file.lower():
                    light_files.append(file)
                elif "map" in file.lower():
                    map_files.append(file)
                elif "ambiance" in file.lower() or "music" in file.lower():
                    music_files.append(file)

            # Save categorized files into Program_BackgroundFilesHolder format with lowercase keys
            folder_tree["background"][background_name] = {
                "darkFiles": dark_files or None,
                "lightFiles": light_files or None,
                "mapFiles": map_files or None,
                "musicFiles": music_files or None,
            }
        elif 'general-sounds' in folder_name:
            for file in files:
                name_key = os.path.splitext(file)[0]
                folder_tree["general-sounds"][name_key] = file
        elif 'menu-icons' in folder_name:
            for file in files:
                name_key = os.path.splitext(file)[0]
                folder_tree["menu-icons"][name_key] = file

    return folder_tree


def save_folder_tree_as_json(folder_path, json_filename):
    """
    This function saves the folder tree structure as a JSON file.

    Args:
        folder_path (str): The root folder path to scan.
        json_filename (str): The name of the JSON file to save the structure.
    """
    folder_tree = get_folder_tree(folder_path)

    # Save the folder tree structure as a JSON file
    with open(json_filename, 'w') as json_file:
        json.dump(folder_tree, json_file, indent=4)

    print(f"Folder tree saved to {json_filename}")

