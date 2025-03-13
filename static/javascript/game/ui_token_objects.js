async function addObject(x, y, {
    inventory = new Inventory(),
    img: pouchImgSrc
}){
    const objectToken = document.createElement("div")
    objectToken.classList.add("pouch")
    objectToken.style.left = `${x}px`
    objectToken.style.top = `${y}px`
    objectToken.style.backgroundImage = pouchImgSrc

    objectToken.addEventListener("click", function(){
        charDisplayInventory({id : player.charId, inventory : inventory}, x, y)
    })

    gameSceneData.objects.push(objectToken)
    characterLayer.appendChild(objectToken)
}