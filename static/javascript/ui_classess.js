const tokenShapeTypes = Object.freeze({
    BOX: 1,
    CIRCLE: 2,
    TRIANGLE: 3,
    HEXAGON: 4,
});

const tokenTypes = Object.freeze({
    CHARACTER: 1,
    BACKGROUND: 2,
});

const userTypes = Object.freeze({
    PLAYER: "adventurer",
    DM: "dungeon_master",
});
class Program_FilePathsHolder {
    constructor({folderClassIcons, folderCharToken,  folderBackgroundToken,folderGeneralSounds, listCharacter, listNPC, listBackground, 
                listClassIcons, listSounds, default_char_profile = "tokens/character/default_profile/char.png"
    } = {}) {
        this.folderCharToken        = folderCharToken;
        this.folderBackgroundToken  = folderBackgroundToken;
        this.folderClassIcons       = folderClassIcons;
        this.folderGeneralSounds    = folderGeneralSounds;
        this.listCharacter    = listCharacter;
        this.listNPC          = listNPC;
        this.listBackground   = listBackground;
        this.listClassIcons   = listClassIcons;
        this.listSounds         = listSounds;
        this.default_char_profile   = default_char_profile;
    }
};

class Porgram_User {
    constructor({
        name,
        type,
        char,
        last_sync        
    } = {}){
        this.name       = name;
        this.type      = type;
        this.char        = char;
        this.last_sync    = last_sync;
    }
}

class Porgram_ServerInfo {
    constructor({
        isUpdating = false,
        name,
        version,
        description,
        server_time,
        objectPositions,
        listEnemies,
        listAllies,
        listNPC,
        inGameChars       
    } = {}){
        this.isUpdating      = isUpdating;
        this.name           = name;
        this.version        = version;
        this.description    = description;
        this.server_time     = server_time;
        this.objectPositions = objectPositions;
        this.listEnemies    = listEnemies;
        this.listAllies    = listAllies;
        this.listNPC         = listNPC;
        this.inGameChars     = inGameChars;
    }
}

class Program_GameUISettings {
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
        icon_edit           = "edit.png",
        icon_buffDebuff     = "buff_debuff.png",
        icon_aura           = "aura.png",  
        icon_cast           = "cast.png",
        icon_save           = "save.png",
        board_size          = 4000,    
        grid_size           = 100,
        max_zoom_in         = 6,
        max_zoom_out        = 0.6,
} = {}) {
        this.icon_downArrowGreen    = icon_downArrowGreen   ;
        this.icon_newFile           = icon_newFile          ;
        this.icon_characterSheet    = icon_characterSheet   ;
        this.icon_rainbowDice       = icon_rainbowDice      ;
        this.icon_closeBar          = icon_closeBar         ;
        this.icon_panning           = icon_panning          ;
        this.icon_cursor            = icon_cursor           ;
        this.icon_center            = icon_center           ;
        this.icon_inventory         = icon_inventory        ;
        this.icon_spellbook         = icon_spellbook        ;
        this.icon_sword             = icon_sword            ;
        this.icon_gold              = icon_gold             ;
        this.icon_silver            = icon_silver           ;
        this.icon_bronze            = icon_bronze           ;
        this.icon_edit              = icon_edit             ;
        this.icon_buffDebuff        = icon_buffDebuff       ;
        this.icon_aura              = icon_aura             ;
        this.icon_save              = icon_save             ;
        this.icon_cast              = icon_cast             ;
        this.folderMenuIcons       = folderMenuIcons;
        this.board_size             = board_size;
        this.grid_size              = grid_size;
        this.max_zoom_in            = max_zoom_in;
        this.max_zoom_out           = max_zoom_out;
    }
};

class Program_GameSettings {
    constructor({
        maxStatPoint = 20,
        minStatPoint = 0,
        maxCharacterLevel = 15,
        minCharacterLevel = 1,
        maxSubClassCount = 2,
        minSubClassCount = 0,
        includedSpellLevels = ['0','1', '2', '3', '4', '5'],
        useEnvorinmentTimeBasedBackground = false, 
    } = {}) {
        this.maxStatPoint   = maxStatPoint;
        this.minStatPoint   = minStatPoint;
        this.maxCharacterLevel   = maxCharacterLevel;
        this.minCharacterLevel   = minCharacterLevel;
        this.maxSubClassCount   = maxSubClassCount;
        this.minSubClassCount   = minSubClassCount;
        this.includedSpellLevels   = includedSpellLevels;
        this.useEnvorinmentTimeBasedBackground = useEnvorinmentTimeBasedBackground;
    }
}

class Program_BackgroundFilesHolder{
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

const destructionTypes = Object.freeze({
    TOKEN: 1,
    EFFECT: 2,
    CONSUMABLE: 3,
});

class Program_Destructionator{
    constructor(
        destructionType,
        {
            tokenId: tokenId,
        }
    ) {
        this.destructionType = destructionType;
        this.tokenId = tokenId;
    }
}