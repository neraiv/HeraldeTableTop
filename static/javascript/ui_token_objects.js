async function addPouch(x, y, inventory = new Inventory()){
    const pouch = document.createElement("div")
    pouch.classList.add("pouch")
    pouch.style.left = `${x}px`
    pouch.style.top = `${y}px`
    pouch.style.backgroundImage = pouchImgSrc

    pouch.inventory = inventory

    pouch.addEventListener("click", function(){
        charDisplayInventory({id : player.charId, inventory : inventory}, x, y)
    })

    characterLayer.appendChild(pouch)
}