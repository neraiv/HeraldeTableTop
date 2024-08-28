class Character {
    constructor(id, {
        maxStatPoint = gameSettings.MAX_STAT_POINT,
        minStatPoint = gameSettings.MIN_STAT_POINT,
        maxCharacterLevel = gameSettings.MAX_CHARACTER_LVL,
        minCharacterLevel = gameSettings.MIN_CHARACTER_LVL,
        maxSubClassCount = gameSettings.MAX_SUB_CLASS_COUNT,
        minSubClassCount = gameSettings.MIN_SUB_CLASS_COUNT,
        level = gameSettings.MIN_CHARACTER_LVL,
        name = "",
        class_ = "",
        subclass = "",
        race = "",
        feats = [],
        dex = gameSettings.MIN_STAT_POINT,
        con = gameSettings.MIN_STAT_POINT,
        int = gameSettings.MIN_STAT_POINT,
        wis = gameSettings.MIN_STAT_POINT,
        cha = gameSettings.MIN_STAT_POINT,
        str = gameSettings.MIN_STAT_POINT,
        availableSpellLevels = {
            '1': 2,
            '2': 2
        },
        learnedSpells = ['Animal Friendship', 'Acid Arrow'],
        inventory = new Inventory()
    } = {}) {
        this.ID = id;
        this.MAX_STAT_POINT = maxStatPoint;
        this.MIN_STAT_POINT = minStatPoint;
        this.MAX_CHARACTER_LVL = maxCharacterLevel;
        this.MIN_CHARACTER_LVL = minCharacterLevel;
        this.MAX_SUB_CLASS_COUNT = maxSubClassCount;
        this.MIN_SUB_CLASS_COUNT = minSubClassCount;
        this.LEVEL = level;
        this.NAME = name;
        this.CLASS_ = class_;
        this.SUBCLASS = subclass;
        this.RACE = race;
        this.FEATS = feats;
        this.DEX = dex;
        this.CON = con;
        this.INT = int;
        this.WIS = wis;
        this.CHA = cha;
        this.STR = str;
        this.AVAILABLE_SPELL_LEVELS = availableSpellLevels;
        this.LEARNED_SPELLS= learnedSpells;
        this.CURRENT_MANA = {};
        this.BUFFS = {};
        this.DEBUFFS = {};
        this.INVENTORY = inventory;
    }

    // Example method to check if a level is valid
    isValidLevel(level) {
        return level >= this.MIN_CHARACTER_LVL && level <= this.MAX_CHARACTER_LVL;
    }

    // Example method to validate stat points
    isValidStatPoint(statPoint) {
        return statPoint >= this.MIN_STAT_POINT && statPoint <= this.MAX_STAT_POINT;
    }
}

class Inventory {
    constructor() {
        this.items = []; // Initialize an empty array to store inventory items
    }

    // Add an item to the inventory
    addItem(itemName, quantity = 1) {
        // Check if the item already exists
        const existingItem = this.items.find(item => item.name === itemName);
        if (existingItem) {
            existingItem.quantity += quantity; // Increase quantity if item exists
        } else {
            this.items.push({ name: itemName, quantity }); // Add new item to the inventory
        }
        console.log(`${itemName} added. Quantity: ${quantity}`);
    }

    // Remove an item from the inventory
    removeItem(itemName, quantity = 1) {
        const itemIndex = this.items.findIndex(item => item.name === itemName);
        if (itemIndex === -1) {
            console.log(`Item ${itemName} not found in inventory.`);
            return;
        }

        const item = this.items[itemIndex];
        if (item.quantity <= quantity) {
            this.items.splice(itemIndex, 1); // Remove item if quantity is less than or equal to the quantity to be removed
            console.log(`${itemName} removed from inventory.`);
        } else {
            item.quantity -= quantity; // Decrease quantity if more than one item
            console.log(`${quantity} ${itemName} removed. Remaining quantity: ${item.quantity}`);
        }
    }

    // List all items in the inventory
    listItems() {
        if (this.items.length === 0) {
            console.log("Inventory is empty.");
            return;
        }

        console.log("Inventory:");
        this.items.forEach(item => {
            console.log(`- ${item.name}: ${item.quantity}`);
        });
    }

    // Get the quantity of a specific item
    getQuantity(itemName) {
        const item = this.items.find(item => item.name === itemName);
        return item ? item.quantity : 0;
    }
}

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
        folderMenuIcons = 'tokens/menu-icons',
        icon_downArrowGreen = "downArrowGreen.png",
        icon_newFile = "newFile.svg",
        icon_characterSheet = "sheet-icon-7.png",
        icon_rainbowDice = "rainbow-dice.png",
        icon_closeBar = "close-bar.png",
        icon_panning = "move.png",
        icon_cursor = "cursor.png",
        icon_center = "center.png",
        icon_inventory = "inventory.png",
        icon_spellbook = "spellbook.png",
        icon_sword = "sword.png",
        board_size = 3000,    
        grid_size = 100,
        max_zoom_in = 6,
        max_zoom_out = 0.6,
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
        this.FOLDER_MENUICONS        = folderMenuIcons;
        this.BOARD_SIZE          = board_size;
        this.GRID_SIZE           = grid_size;
        this.MAX_ZOOM_IN         = max_zoom_in;
        this.MAX_ZOOM_OUT        = max_zoom_out;
    }
};

class SettingsGame {
    constructor({
        maxStatPoint = 20,
        minStatPoint = 0,
        maxCharacterLevel = 15,
        minCharacterLevel = 1,
        maxSubClassCount = 2,
        minSubClassCount = 0,
        includedSpellLevels = ['1', '2', '3', '4', '5']
    } = {}) {
        this.MAX_STAT_POINT = maxStatPoint;
        this.MIN_STAT_POINT = minStatPoint;
        this.MAX_CHARACTER_LVL = maxCharacterLevel;
        this.MIN_CHARACTER_LVL = minCharacterLevel;
        this.MAX_SUB_CLASS_COUNT = maxSubClassCount;
        this.MIN_SUB_CLASS_COUNT = minSubClassCount;
        this.INCLUDED_SPELL_LEVELS = includedSpellLevels;
    }
}

class Environment{
    constructor({
        day = 0,
        time = 8.0,
    } = {}) {
        this.DAY = day;
        this.TIME = time;
    }
}

