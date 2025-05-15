class HdCharToken extends HdTokenObject {
    constructor({charID, x, y, width, height, texturePath, name}) {
        super(charID, x, y, width, height, texturePath, charTokenZIndex, name);
        this.buttonInventory = null;
        this.buttonSpellbook = null;
        this.buttonWeapon = null;
        this.flags = {
            hoverChar: false,
            hoverInventory: false,
            hoverSpellbook: false,
            hoverWeapon: false
        }
        this.hideButtonTimeout = null;
        this.initButtons();
        console.log('HdCharToken created:', {charID, x, y, width, height});
    }

    initButtons() {
        const buttonSize = 50;
        const buttonPadding = 1.5 * buttonSize;
        const buttonOffset = 50;

        this.buttonInventory = createPixieImageButton(buttonSize, {source: '../static/images/menu-icons/inventory.png'});
        this.buttonInventory.visible = false;
        this.buttonInventory.x = this.width / 2 - buttonSize / 2 + this.x  
        this.buttonInventory.y = this.y - buttonOffset
        this.buttonInventory.on('pointerover', () => {
            this.flags.hoverInventory = true;
            this.handleButtonsVisiblty();
        });
        this.buttonInventory.on('pointerout', () => {
            this.flags.hoverInventory = false;
            this.handleButtonsVisiblty();
        }); 
        this.buttonInventory.on('pointerdown', () => {
            displayInventory(this.charID, database.chars[this.charID].char.inventory, event.clientX, event.clientY);
        });
        uiLayer.addChild(this.buttonInventory);

        this.buttonSpellbook = createPixieImageButton(buttonSize, {source: '../static/images/menu-icons/spellbook.png'});
        this.buttonSpellbook.visible = false;
        this.buttonSpellbook.x = this.width / 2 - buttonSize / 2 + this.x - buttonPadding;
        this.buttonSpellbook.y = this.y - buttonOffset;
        this.buttonSpellbook.on('pointerover', () => {
            this.flags.hoverSpellbook = true;
            this.handleButtonsVisiblty();
        });
        this.buttonSpellbook.on('pointerout', () => {
            this.flags.hoverSpellbook = false;
            this.handleButtonsVisiblty();
        }); 
        this.buttonSpellbook.on('pointerdown', () => {
            displaySpellbook(this.charID, database.chars[this.charID].char.spellbook, event.clientX, event.clientY);
        });
        uiLayer.addChild(this.buttonSpellbook);
        
        this.buttonWeapon = createPixieImageButton(buttonSize, {source: '../static/images/menu-icons/sword.png'});
        this.buttonWeapon.visible = false;
        this.buttonWeapon.x = this.width / 2 - buttonSize / 2 + this.x + buttonPadding;
        this.buttonWeapon.y = this.y - buttonOffset;
        this.buttonWeapon.on('pointerover', () => {
            this.flags.hoverWeapon = true;
            this.handleButtonsVisiblty();
        });
        
        this.buttonWeapon.on('pointerout', () => {
            this.flags.hoverWeapon = false;
            this.handleButtonsVisiblty();
        });

        this.buttonWeapon.on('pointerdown', () => {
            displayWeapon(this.charID, database.chars[this.charID].char.weapon, event.clientX, event.clientY);
        });
        uiLayer.addChild(this.buttonWeapon); 
    }

    onHover() {
        this.setHighlight(true);
        this.showButtons();
    }

    onLeave() {
        this.setHighlight(false);
        this.setHideButtonTimeout();
    }

    handleButtonsVisiblty(){
        if(this.flags.hoverChar || this.flags.hoverInventory || this.flags.hoverSpellbook || this.flags.hoverWeapon){
            if(this.hideButtonTimeout){
                clearTimeout(this.hideButtonTimeout);
                this.hideButtonTimeout = null;
            }
            this.showButtons();
        } else {
            this.setHideButtonTimeout();
        }
    }

    showButtons() {
        this.buttonInventory.visible = true;
        this.buttonSpellbook.visible = true;
        this.buttonWeapon.visible = true;
    }

    setHideButtonTimeout() {
        this.hideButtonTimeout = setTimeout(() => {
            this.hideButtons();
        }, hideCharTokenButtonsTimeout);
    }

    hideButtons() {
        this.buttonInventory.visible = false;
        this.buttonSpellbook.visible = false;
        this.buttonWeapon.visible = false;
    }
    
}
  

async function conjureCharToken(charId) {
    console.log('Conjuring char token for:', charId);

    if (!database.chars[charId]) {
        const res = await sendRequest({event: 'get', payload: {type: "char", id: charId}});
        if(res.success){
            database.chars[charId] = res.data;
        } else {
            return null;
        }
    }

    const char = new HdCharToken({
        charId: charId,
        x: 200,
        y: 200,
        width: database.chars[charId].width,
        height: database.chars[charId].height,
        texturePath: '../static/images/character/' + database.chars[charId].img,
        name: database.chars[charId].char.name
    });
    await char.load();
    char.addToStage(gameLayer);
    gameBoardData.chars.push(char);
    return char;
}

