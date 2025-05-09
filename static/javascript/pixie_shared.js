 function createPixieImageButton(fontSize, {icon=null, source=null, custom_padding = 8, toolTip=null}) {
    // Create a container for the button
    const button = new PIXI.Container();
    button.interactive = true;
    button.buttonMode = true;
    button.scale.set(1); // Lock scale to 1
    button.scale.x = 1; // Ensure x scale is 1
    button.scale.y = 1; // Ensure y scale is 1

    // Create the button background
    const background = new PIXI.Graphics();
    background.beginFill(0xFFFFFF);
    background.drawRoundedRect(0, 0, fontSize, fontSize, 5);
    background.endFill();
    button.addChild(background);

    if (source) {
        // Load and use an image source
        const texture = PIXI.Texture.from(source);
        const img = new PIXI.Sprite(texture);
        img.width = fontSize - custom_padding;
        img.height = fontSize - custom_padding;
        img.x = custom_padding / 2;
        img.y = custom_padding / 2;
        img.scale.set(1); // Lock image scale to 1
        button.addChild(img);
    } else if (icon) {
        // Use text icon
        const text = new PIXI.Text(icon, {
            fontSize: fontSize - custom_padding,
            fill: 0x000000
        });
        text.x = custom_padding / 2;
        text.y = custom_padding / 2;
        text.scale.set(1); // Lock text scale to 1
        button.addChild(text);
    }

    if (toolTip) {
        button.tooltip = toolTip;
    }

    return button;
}
