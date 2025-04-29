class HdTokenObject {
    constructor(id, x, y, width, height, texturePath, zIndex) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.texturePath = texturePath;
        this.sprite = null;
        this.zIndex = zIndex;
    }

    async load() {
        await PIXI.Assets.load(this.texturePath);
    }

    addToStage(stage) {
        const texture = PIXI.Assets.get(this.texturePath);
    
        // Force nearest neighbor scaling (no blur when resized)
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    
        const sprite = new PIXI.Sprite(texture);
        sprite.width = this.width;
        sprite.height = this.height;
        sprite.x = this.x;
        sprite.y = this.y;
        sprite.zIndex = this.zIndex || 0;  // 👈 Add this line
        
        // Enable interactivity
        sprite.interactive = true;
        
        // Add Events
        if (this.onHover) {
            sprite.on('pointerover', () => {
                this.onHover();
            });
        }

        if (this.onLeave){
            sprite.on('pointerout', () => {
                this.onLeave();
            });
        }

        if (this.onClick){
            sprite.on('pointerdown', () => {
                this.onClick();
            });
        }

        stage.addChild(sprite);
        this.sprite = sprite;
    }
    

    moveTo(x, y) {
        this.x = x;
        this.y = y;
        if (this.sprite) {
            this.sprite.x = x;
            this.sprite.y = y;
        }
    }

    removeFromStage() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }

    setHighlight(state = true) {
        if (this.sprite) {
            this.sprite.tint = state ? 0x00ff00 : 0xffffff;
        }
    }
    
    setVisible(state = true) {
        if (this.sprite) {
            this.sprite.visible = state;
        }
    }

    setZIndex(zIndex) {
        this.zIndex = zIndex;
        if (this.sprite) {
            this.sprite.zIndex = zIndex;
        }
    }

}