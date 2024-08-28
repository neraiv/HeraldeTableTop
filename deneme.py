import os

def list_files(directory):
    """Return a dictionary of folder names and their file lists."""
    folders = {}
    for root, dirs, files in os.walk(directory):
        # Skip hidden directories and files
        if any(part.startswith('.') for part in root.split(os.sep)):
            continue
        
        # Relative path from the base directory
        relative_root = os.path.relpath(root, directory)
        
        # Collect file names
        files = [f for f in files if not f.startswith('.')]
        
        if relative_root == '.':
            relative_root = ''
        
        if relative_root not in folders:
            folders[relative_root] = []
        
        folders[relative_root].extend(files)
    
    return folders

def create_js_classes(folders):
    """Create JavaScript classes from the folder structure."""
    # Define paths and image lists
    folder_char_token = 'tokens/character'
    folder_background_token = 'tokens/background'
    folder_class_icons = 'tokens/class-icons'
    folder_general_sounds = 'tokens/general-sounds'
    
    image_list_character = [name.split('/')[1].replace('.jpg', '') for name in folders.get('tokens/character', []) if name.endswith('.jpg')]
    image_list_background = [name.split('/')[1].replace('.jpg', '') for name in folders.get('tokens/background', []) if name.endswith('.jpg')]
    image_list_class_icons = [name for name in folders.get('tokens/class-icons', [])]
    
    default_char_profile = 'tokens/character/default-profile/char.png'
    
    js_classes = f"""\
class TokenPaths {{
    constructor({{ 
        folderClassIcons = '{folder_class_icons}', 
        folderCharToken =  '{folder_char_token}', 
        folderBackgroundToken = '{folder_background_token}', 
        folderGeneralSounds = '{folder_general_sounds}', 
        imageList_Character = {image_list_character},
        imageList_Background = {image_list_background},
        imageList_ClassIcons = {image_list_class_icons},
        default_char_profile = "{default_char_profile}"
    }} = {{}}) {{
        this.FOLDER_CHARTOKEN        = folderCharToken;
        this.FOLDER_BACKGROUNDTOKEN  = folderBackgroundToken;
        this.FOLDER_CLASSICONS       = folderClassIcons;
        this.FOLDER_GENERALSOUNDS    = folderGeneralSounds;
        this.IMAGELIST_CHARACTER    = imageList_Character;
        this.IMAGELIST_BACKGROUND   = imageList_Background;
        this.IMAGELIST_CLASSICONS   = imageList_ClassIcons;
        this.DEFAULT_CHAR_PROFILE   = default_char_profile;
    }}
}};
class SettingsUI {{
    constructor({{
        folderMenuIcons = 'tokens/menu-icons',
        icon_downArrowGreen = "downArrowGreen.png",
        icon_newFile = "newFile.svg",
        icon_characterSheet = "sheet-icon-7.png",
        icon_rainbowDice = "rainbow-dice.png",
        icon_closeBar = "close-bar.png",
        icon_panning = "move.png",
        icon_cursor = "cursor.png",
        icon_center = "center.png",
        board_size = 3000,    
        grid_size = 100,
        max_zoom_in = 6,
        max_zoom_out = 0.6,
    }} = {{}}) {{
        this.ICON_DOWNARROWGREEN   = icon_downArrowGreen;
        this.ICON_NEWFILE          = icon_newFile;
        this.ICON_CHARACTERSHEET   = icon_characterSheet;
        this.ICON_RAINBOWDICE      = icon_rainbowDice;
        this.ICON_CLOSEBAR         = icon_closeBar;
        this.ICON_PANNING          = icon_panning;
        this.ICON_CURSOR           = icon_cursor;
        this.ICON_CENTER           = icon_center;
        this.FOLDER_MENUICONS        = folderMenuIcons;
        this.BOARD_SIZE          = board_size;
        this.GRID_SIZE           = grid_size;
        this.MAX_ZOOM_IN         = max_zoom_in;
        this.MAX_ZOOM_OUT        = max_zoom_out;
    }}
}};
"""
    return js_classes

def write_to_file(filename, content):
    """Write the content to a file."""
    with open(filename, 'w') as file:
        file.write(content)

def main():
    base_directory = 'tokens'
    folders = list_files(base_directory)
    js_classes = create_js_classes(folders)
    write_to_file('class.txt', js_classes)

if __name__ == '__main__':
    main()
