class HdGroundToken extends HdTokenObject {
    constructor({id, x, y, width, height, texturePath}) {
        super(id, x, y, width, height, texturePath, groundTokenZIndex);
    }
}


async function conjureGroundToken(id) {
    const groundToken = new HdGroundToken({
        id: id,
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        texturePath: '../static/images/background/royal-bank-1/dark_1.jpg'
    });
    await groundToken.load();
    groundToken.addToStage(gameLayer);
}



