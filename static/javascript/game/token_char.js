class HdCharToken extends HdTokenObject {
    constructor({charID, x, y, width, height, texturePath}) {
        super(charID, x, y, width, height, texturePath, charTokenZIndex);
        this.buttons = [];
        this.buttonSize = 80;
        this.radius = width / 2;
        console.log('HdCharToken created:', {charID, x, y, width, height});
    }

    onHover() {
        console.log('onHover called');
        this.setHighlight(true);
        this.showButtons();
    }

    onLeave() {
        console.log('onLeave called');
        this.setHighlight(false);
        this.hideButtons();
    }

    addButton(angle, texturePath, onClick) {
        console.log('Adding button:', {angle, texturePath});
        
        // Create a colored rectangle as fallback
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x3498db); // Blue color
        graphics.drawRoundedRect(0, 0, this.buttonSize, this.buttonSize, 5);
        graphics.endFill();
        
        // Create sprite with texture or graphics
        const button = new PIXI.Sprite();

        button.texture = app.renderer.generateTexture(graphics);
        
        
        button.width = this.buttonSize;
        button.height = this.buttonSize;
        button.interactive = true;
        button.buttonMode = true;
        
        // Calculate final position
        const {finalX, finalY} = calcButtonsAroundLocation(this.buttonSize, this.width, angle);
        button.finalX = finalX;
        button.finalY = finalY;
        
        // Set initial position to center
        button.x = this.width / 2 - this.buttonSize / 2 + this.x;
        button.y = this.height / 2 - this.buttonSize / 2 + this.y;
        
        // Add click handler
        button.on('pointerdown', onClick);
        
        this.buttons.push(button);
        this.sprite.addChild(button);
        console.log('Button added to sprite:', button);
    }


    showButtons() {
        console.log('Showing buttons:', this.buttons.length);
        this.buttons.forEach(button => {
            button.visible = true;
            console.log('Animating button to:', {x: button.finalX, y: button.finalY});
            gsap.to(button, {
                x: button.finalX,
                y: button.finalY,
                duration: 0.3
            });
        });
    }

    hideButtons() {
        console.log('Hiding buttons');
        this.buttons.forEach(button => {
            gsap.to(button, {
                x: this.width / 2 - this.buttonSize / 2,
                y: this.height / 2 - this.buttonSize / 2,
                duration: 0.3,
                onComplete: () => {
                    button.visible = false;
                }
            });
        });
    }
}
  

async function conjureCharToken(charID) {
    console.log('Conjuring char token for:', charID);
    const char = new HdCharToken({
        charID: charID,
        x: 200,
        y: 200,
        width: 50,
        height: 50,
        texturePath: '../static/images/character/void_elf/char.png'
    });
    await char.load();
    char.addToStage(app.stage);

    // Add inventory button
    char.addButton(45, '../static/images/menu-icons/inventory.png', (event) => {
        displayInventory(charID, database.chars[charID].char.inventory, event.clientX, event.clientY);
    });

    // Add spellbook button
    char.addButton(90, '../static/images/menu-icons/spellbook.png', (event) => {
        // Add spellbook functionality here
    });

    // Add weapon button
    char.addButton(135, '../static/images/menu-icons/sword.png', (event) => {
        // Add weapon functionality here
    });

    return char;
}