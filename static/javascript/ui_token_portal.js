async function portalDisplayName(portalToken){
    const portalName = portalToken.firstChild
    portalName.style.display = "block"
}

async function portalHideName(portalToken){
    const portalName = portalToken.firstChild
    portalName.style.display = "none"
}

async function addPortal(id, portal){
    const portalToken = document.createElement("div")
    portalToken.id = "portal-" + id
    portalToken.classList.add("portal")
    portalToken.classList.add("type-"+portal.type)
    portalToken.style.left = `${portal.x}px`
    portalToken.style.top = `${portal.y}px`
    portalToken.style.width = `${portal.width}px`
    portalToken.style.height = `${portal.height}px`
    portalToken.type = portal.type
    characterLayer.appendChild(portalToken)

    const portalText = portal.scene + "-" + portal.layer
    const portalName = document.createElement("div")
    portalName.classList.add("portal-name")
    portalName.textContent = portalText
    portalName.style.marginBottom = `${portal.height+5}px`
    portalToken.appendChild(portalName)

    if(portal.type == "layer"){ // FUTURE: Check for valid url
        portalToken.style.backgroundImage = `url("static/images/portal/blue.png")` 
    }else if(portal.type == "scene"){
        portalToken.style.backgroundImage = `url("static/images/portal/green.png")` 
    }

    portalToken.addEventListener("mouseenter", async function(){
        portalDisplayName(portalToken)
    })

    portalToken.addEventListener("mouseleave", async function(){
        portalHideName(portalToken)
    })

    portalToken.addEventListener("click", async function(){
        const actionInfo = await sendRequest({type: "action", payload: {action: "portal", data: portalText}})
        if (actionInfo.success === false){
            alert("Failed to perform action")
        }
    })

    return portalToken
}