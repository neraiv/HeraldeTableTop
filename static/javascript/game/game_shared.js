targetTypes

targetOrderList

function getCharDataById(tokenId) {
    return database.chars[tokenId];
}

function getFlagRelation(tokenId) {
    const charData = getCharDataById(tokenId);
    if (!charData) return null;

    return charData.char.flag
}

function getClosestEnemy(tokenId) { // merge with findCloses decide using flagRelation
    const flagRelation = getFlagRelation(tokenId)

    for (const token of gameSceneData.chars) {
        const enemyCharData = getCharDataById(token.id);
        if (!enemyCharData) continue;
        if (enemyCharData.char.flag in flagRelation.enemies) {
            return token.id;
        }
    }
}

function findClosest(tokenId, targetType) {
    switch (targetType) {
        case targetTypes.ENEMY:
            return getClosestEnemy(tokenId);
        case targetTypes.ALLY:
            return getClosestAlly(tokenId);
        case targetTypes.SELF:
            return tokenId;
        case targetTypes.ANY:
            return getClosestAny(tokenId);
        default:
            throw new Error("Unknown target type");
    }
}


function selectTarget(tokenId, targetOrder, targetType) {

    for (let i = 0; i < targetOrder.length; i++) {
        const targetting = dictFindValueName(targetOrderList, targetOrder[i])
        if ("CLOSEST" in targetting) {
            return targetOrder[i]
        }
    }
}