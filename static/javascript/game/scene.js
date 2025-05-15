async function initScene() {
    const scene = database.sceneData
    const layer = scene.layer
    const locations = layer.locations
    const portals = locations.portals
    const chars = locations.chars
    const npcs = locations.npcs
    const objects = locations.objects

    for(const char in chars) {
        conjureCharToken(char);   
    }

    for(const npc in npcs){
        if(!database.npcs[npc]){
            const res = await sendRequest({event: 'get', payload: {type: "npc", id: npc}});
            if(res.success){
                database.npcs[npc] = res.data
            }
        }
    }
}
