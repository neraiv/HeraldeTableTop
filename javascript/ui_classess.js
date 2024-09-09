/* Will change to struct 
let TokenPaths= {
    folderClaasIcons: 'tokens/class-icons'
};
like this
*/
class TokenPaths {
    constructor({
        folderClassIcons = 'tokens/class-icons',
        folderCharToken =  'tokens/character',
        folderBackgroundToken = 'tokens/background',
        folderGeneralSounds = 'tokens/general-sounds',
        imageList_Character =  ['coil', 'dedector', 'druid-woman', 'elf-warrior-woman'],
        imageList_Background = ['detector-green-1', 'alchemy-shop-1', 'fighting-pit-muddy-1', 'living-depths-1', 'living-depths-2','metalsmith-workshop-1','ossuary-of-xilbalba-1',
                                'palatial-portal-1','royal-bank-1'],
        imageList_ClassIcons = ['barbarian.png', 'archer.png', 'bard.png', 'brawler.png', 'cleric.png', 'druid.png', 'fighter.png', 'mage.png', 'ranger.png', 'thief.png', 'warlock.png'],
        default_char_profile = "tokens/character/default-profile/char.png"
    } = {}) {
        this.FOLDER_CHARTOKEN        = folderCharToken;
        this.FOLDER_BACKGROUNDTOKEN  = folderBackgroundToken;
        this.FOLDER_CLASSICONS       = folderClassIcons;
        this.FOLDER_GENERALSOUNDS    = folderGeneralSounds;
        this.IMAGELIST_CHARACTER    = imageList_Character;
        this.IMAGELIST_BACKGROUND   = imageList_Background;
        this.IMAGELIST_CLASSICONS   = imageList_ClassIcons;
        this.DEFAULT_CHAR_PROFILE   = default_char_profile;
    }
};

class SettingsUI {
    constructor({
        folderMenuIcons     = 'tokens/menu-icons',
        icon_downArrowGreen = "downArrowGreen.png",
        icon_newFile        = "newFile.svg",
        icon_characterSheet = "sheet-icon-7.png",
        icon_rainbowDice    = "rainbow-dice.png",
        icon_closeBar       = "close-bar.png",
        icon_panning        = "move.png",
        icon_cursor         = "cursor.png",
        icon_center         = "center.png",
        icon_inventory      = "inventory.png",
        icon_spellbook      = "spellbook.png",
        icon_sword          = "sword.png",
        icon_gold           = "gold.png",
        icon_silver         = "silver.png",
        icon_bronze         = "bronze.png",
        board_size          = 3000,    
        grid_size           = 100,
        max_zoom_in         = 6,
        max_zoom_out        = 0.6,
} = {}) {
        this.ICON_DOWNARROWGREEN   = icon_downArrowGreen ;
        this.ICON_NEWFILE          = icon_newFile        ;
        this.ICON_CHARACTERSHEET   = icon_characterSheet ;
        this.ICON_RAINBOWDICE      = icon_rainbowDice    ;
        this.ICON_CLOSEBAR         = icon_closeBar       ;
        this.ICON_PANNING          = icon_panning      ;
        this.ICON_CURSOR           = icon_cursor       ;
        this.ICON_CENTER           = icon_center       ;
        this.ICON_INVENTORY         = icon_inventory;
        this.ICON_SPELLBOOK        = icon_spellbook      ;
        this.ICON_SWORD            = icon_sword          ;
        this.ICON_GOLD             = icon_gold           ;
        this.ICON_SILVER           = icon_silver           ;
        this.ICON_BRONZE           = icon_bronze           ;
        this.FOLDER_MENUICONS        = folderMenuIcons;
        this.BOARD_SIZE          = board_size;
        this.GRID_SIZE           = grid_size;
        this.MAX_ZOOM_IN         = max_zoom_in;
        this.MAX_ZOOM_OUT        = max_zoom_out;
    }
};

class BackgroundFilesInfo {
    constructor(
        darkFiles = null,
        lightFiles = null,
        mapFiles = null,
        musicFiles = null
    ) {
        this.DARK_FILES = darkFiles;
        this.LIGHT_FILES = lightFiles;
        this.MAP_FILES = mapFiles;
        this.MUSIC_FILES = musicFiles;
    }
}

