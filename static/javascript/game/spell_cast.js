function spellCast(tokenID, spell, mana=0) {
    if (!tokenID || !spell) return;

    const tokenRect = objectsPositions.get(tokenID)[1];
    const char = inGameChars.get(tokenID);

    char.action = characterActions.CASTING;

    const tokenCenterX = tokenRect.x + tokenRect.width / 2
    const tokenCenterY = tokenRect.y + tokenRect.height / 2
    
    const spellCastTarget = document.createElement('div');
    const spellRangeCircle = document.createElement('div');
    spellCastTarget.classList.add('spell-cast'); 

    // const spellBox = document.createElement('div');
    // spellBox.style.border = '1px solid black';
    // spellBox.style.borderLeftWidth = '3px';
    // spellBox.style.borderTopWidth = '3px';
    // spellBox.style.width = '100%';
    // spellBox.style.height = '100%';

    let spellPattern = spell.spellPattern.pattern;
    let spellArea = spell.spellPattern.area;
    let spellRange = spell.spellPattern.range;

    if(spell.spendManaEffects[mana]){
        const allBuffs = getAdditionalEffectBonuses(spell.spendManaEffects[mana].caster, characterActions.CASTING, additionalEffectTypes.BUFF, [effectTypes.ATTACK_RADIUS_BONUS, effectTypes.ATTACK_RANGE_BONUS, effectTypes.PATTERN_CHANGE]);
        const radiusBonusesSum = allBuffs.get(effectTypes.ATTACK_RADIUS_BONUS).reduce((sum, bonus) => sum + parseInt(bonus), 0);
        const rangeBonusesSum = allBuffs.get(effectTypes.ATTACK_RANGE_BONUS).reduce((sum, bonus) => sum + parseInt(bonus), 0);
        const patternChange = allBuffs.get(effectTypes.PATTERN_CHANGE);
    
        spellArea += radiusBonusesSum;
        spellRange += rangeBonusesSum;
        if(patternChange.length == 1){
            spellPattern = patternChange[0];
        }
    }

    if(spellPattern === spellPatterns.CIRCULAR) {
        //spellCastTarget.appendChild(spellBox);
        spellCastTarget.classList.add('spell-circular');
    } else if(spellPattern === spellPatterns.BOX) {
        spellCastTarget.classList.add('spell-box');
        //spellCastTarget.appendChild(spellBox);
    } else if(spellPattern === spellPatterns.CONE_UPWARD || spellPattern === spellPatterns.CONE_DOWNWARD) {
        spellCastTarget.classList.add('spell-cone');
    }

    spellCastTarget.style.left = `${tokenCenterX - spellArea / 2}px`;

    if(spell.spellPattern.castType == castTypes.FROM_CASTER) {
        spellCastTarget.classList.add('spell-from-caster');
        spellCastTarget.style.top = `${tokenCenterY}px`;
    }else if(spell.spellPattern.castType == castTypes.AROUND_CASTER){
        spellCastTarget.style.top = `${tokenCenterY}px`;
        spellCastTarget.style.left = `${tokenCenterX}px`;
        spellCastTarget.style.transform = 'translate(-50%, -50%)';
    } else {
        spellCastTarget.style.top = `${tokenCenterY - spellArea / 2}px`;
    }

    if(spellPattern !== spellPatterns.CONE_UPWARD && spellPattern !== spellPatterns.CONE_DOWNWARD) {
        spellCastTarget.style.width = `${spellArea}px`;
        spellCastTarget.style.height = `${spellArea}px`;

    } else {
        if(spellPattern === spellPatterns.CONE_DOWNWARD) {
            spellCastTarget.style.borderWidth = `0px ${spellArea / 2}px ${spellArea}px ${spellArea / 2}px`;
        } else {
            spellCastTarget.style.borderWidth = `${spellArea}px ${spellArea / 2}px 0px ${spellArea / 2}px`;
        }
    }

    spellRangeCircle.classList.add('spell-range');
    spellRangeCircle.style.left = `${tokenCenterX - spellRange}px`;
    spellRangeCircle.style.top = `${tokenCenterY - spellRange}px`;
    spellRangeCircle.style.width = `${spellRange*2}px`;
    spellRangeCircle.style.height = `${spellRange*2}px`;

    const bgLayer = document.getElementById('background-layer');
    bgLayer.appendChild(spellCastTarget);
    bgLayer.appendChild(spellRangeCircle);

    // const out = createTestDots(bgLayer, 4);
    // out[0].style.borderColor = 'black';

    let overlappedTokens = new Map();

    // Function to check if two convex shapes overlap using SAT
    function isCircleOverlap(spellShape, targetShape, both_cirle = false){
        if(both_cirle){
            if(twoPointsDistance(spellShape[0].centerx, spellShape[0].centery, targetShape[0].centerx, targetShape[0].centery) <= spellShape[0].area) return true
        }else {
            for(let i = 0; i < targetShape.length; i++){
                if(twoPointsDistance(spellShape[0].centerx, spellShape[0].centery, targetShape[i].x, targetShape[i].y) <= spellShape[0].area) return true;        
            }
        }
    }
    
    function isOverlap(spellShape, angle, rotationCenterX, rotationCenterY, targetShape) {
        // Step 1: Rotate the spellShape based on the angle and rotation center
        const rotatedSpellShape = rotateShapePoints(spellShape, rotationCenterX, rotationCenterY, angle);

        // for(let i = 0; i < spellShape.length; i++){
        //     out[i].style.left = `${rotatedSpellShape[i].x-3}px`
        //     out[i].style.top    = `${rotatedSpellShape[i].y-3}px`
        // }
        // Step 2: Check if the two shapes overlap using SAT
        return checkSAT(rotatedSpellShape, targetShape);
    }

    // SAT helper: Checks if two convex shapes overlap
    function checkSAT(shape1, shape2) {
        // Combine all edges from both shapes
        const allEdges = getEdges(shape1).concat(getEdges(shape2));

        // For each edge, project both shapes onto the perpendicular axis and check for overlap
        for (let edge of allEdges) {
            const axis = getPerpendicularAxis(edge);

            const projection1 = projectShape(shape1, axis);
            const projection2 = projectShape(shape2, axis);

            if (!overlap(projection1, projection2)) {
                return false;  // No overlap on this axis means the shapes do not overlap
            }
        }

        return true;  // Shapes overlap on all axes
    }

    // Helper: Get all edges of a shape
    function getEdges(shape) {
        const edges = [];
        for (let i = 0; i < shape.length; i++) {
            const nextIndex = (i + 1) % shape.length;
            edges.push({
                x: shape[nextIndex].x - shape[i].x,
                y: shape[nextIndex].y - shape[i].y
            });
        }
        return edges;
    }

    // Helper: Get the perpendicular axis for an edge
    function getPerpendicularAxis(edge) {
        return {
            x: -edge.y,  // Perpendicular axis (swap and negate)
            y: edge.x
        };
    }

    // Helper: Project a shape onto an axis and return the min and max projection values
    function projectShape(shape, axis) {
        let min = dotProduct(shape[0], axis);
        let max = min;

        for (let i = 1; i < shape.length; i++) {
            const projection = dotProduct(shape[i], axis);
            if (projection < min) {
                min = projection;
            }
            if (projection > max) {
                max = projection;
            }
        }

        return { min, max };
    }

    // Helper: Check if two projections overlap
    function overlap(projection1, projection2) {
        return projection1.max >= projection2.min && projection2.max >= projection1.min;
    }

    // Helper: Calculate the dot product of a point and an axis
    function dotProduct(point, axis) {
        return point.x * axis.x + point.y * axis.y;
    }


    // Helper: Rotate point around center
    function rotatePoint(px, py, cx, cy, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const dx = px - cx;
        const dy = py - cy;

        return {
            x: cx + dx * cos - dy * sin,
            y: cy + dx * sin + dy * cos
        };
    }

    function rotateShapePoints(shape, rotationCenterX, rotationCenterY, angle) {
        const rotatedShape = shape.map(point => rotatePoint(point.x, point.y, rotationCenterX, rotationCenterY, angle));
        return rotatedShape;
    }

    function twoPointsDistance(p1x, p1y, p2x, p2y){
        return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
    }

    function twoPointsAngle(p1x, p1y, p2x, p2y){
        return Math.atan2(p2y - p1y, p2x - p1x);
    }

    let distance = 0;
    let mouse;

    const dontAttackTargetTpyes = getMissingArrayValues(spell.spellPattern.canTarget, Object.values(targetTypes));

    function updatePosition(event) {
        mouse = getMousePositionOnGameboard(event);
        distance = twoPointsDistance(tokenCenterX, tokenCenterY, mouse.x, mouse.y);

        const mouseAngle = twoPointsAngle(tokenCenterX, tokenCenterY, mouse.x, mouse.y);

        const angle = mouseAngle + (1.5 * Math.PI)

        let newX, newY, spellWidth, spellHeight, rotationCenterX, rotationCenterY = 0;
        let corners = [];
        if (spell.spellPattern.castType === castTypes.FROM_CASTER) {
            distance = Math.min(distance, spellRange);
            spellCastTarget.style.transform = `rotate(${(angle * 180 / Math.PI) % 360}deg)`;

            if (spell.spellPattern.pattern !== spellPatterns.CONE_UPWARD && spellPattern.pattern !== spellPatterns.CONE_DOWNWARD) {
                spellCastTarget.style.height = `${distance}px`;
            } else {
                // Handle cone spellPatterns with borders
                if (spell.spellPattern.pattern == spellPatterns.CONE_DOWNWARD) {
                    spellCastTarget.style.borderBottomWidth = `${distance}px`;
                    spellCastTarget.style.borderTop = 'none';
                } else {
                    spellCastTarget.style.borderBottom = 'none';
                    spellCastTarget.style.borderTopWidth = `${distance}px`;
                }
            }
            spellWidth = spellArea;
            spellHeight = distance;
            newX = tokenCenterX - spellArea / 2;
            newY = tokenCenterY;
            rotationCenterX = tokenCenterX
            rotationCenterY = tokenCenterY
        } else if(spell.spellPattern.castType == castTypes.ON_LOCATION) {
            // castType.ON_LOCATION
            newX = mouse.x - spellArea / 2;
            newY = mouse.y - spellArea / 2;

            if (distance > spellRange) {
                newX = tokenCenterX + spellRange * Math.cos(angle) - spellCastTarget.offsetWidth / 2;
                newY = tokenCenterY + spellRange * Math.sin(angle) - spellCastTarget.offsetHeight / 2;
            }
            
            spellWidth = spellArea;
            spellHeight = spellArea;

            rotationCenterX = mouse.x;
            rotationCenterY = mouse.y;

            spellCastTarget.style.left = `${newX}px`;
            spellCastTarget.style.top = `${newY}px`;
            spellCastTarget.style.transform = `rotate(${(angle * 180 / Math.PI) % 360}deg)`;
        } else if (spell.spellPattern.castType == castTypes.AROUND_CASTER) {

            const newSpellAreaRadius = (distance <= spellRange) ? distance : spellRange;
            
            const newSpellArea =  (newSpellAreaRadius <= spellArea/2) ? spellArea : newSpellAreaRadius * 2;
            newX = tokenCenterX - newSpellArea /2
            newY = tokenCenterY - newSpellArea /2;
            spellHeight = newSpellArea;
            spellWidth = newSpellArea;
            
            rotationCenterX = tokenCenterX
            rotationCenterY = tokenCenterY

            spellCastTarget.style.height = `${newSpellArea}px`;
            spellCastTarget.style.width = `${newSpellArea}px`;
            spellCastTarget.style.transform = `translate(-50%, -50%) rotate(${(angle * 180 / Math.PI) % 360}deg)`;
        }
        
        if (spell.spellPattern.pattern == spellPatterns.BOX) {
            spellCastTarget.style.height = `${distance}px`;
            corners.push(
                {x: newX, y: newY},
                {x: newX + spellWidth, y: newY},
                {x: newX + spellWidth, y: newY + spellHeight},
                {x: newX, y: newY + spellHeight}
            )     
        } else if (spell.spellPattern.pattern == spellPatterns.CIRCULAR){
            corners.push(
                {centerx: rotationCenterX, centery: rotationCenterY, area: spellWidth/2},
            )   
        } 
        else if (spell.spellPattern.pattern == spellPatterns.CONE_DOWNWARD) {
            corners.push(
                {x: newX + spellWidth/2, y: newY},
                {x: newX, y: newY + spellHeight},
                {x: newX + spellWidth, y: newY +spellHeight}
            )   
        } else if (spell.spellPattern.pattern == spellPatterns.CONE_UPWARD) {
            corners.push(
                {x: newX + spellWidth/2 , y: newY + spellHeight},
                {x: newX, y: newY},
                {x: newX + spellWidth, y: newY}
            )   
        }

        // Now we need to check for overlap using the rotated bounds (for castTypes.FROM_CASTER)
        objectsPositions.forEach((target, tokenKey) => {
            if(!spell.spellPattern.canTarget.includes(targetTypes.ANY)){
                if(dontAttackTargetTpyes.includes(targetTypes.ALLY) && listAllies.includes(tokenKey)){
                    return;
                } 
                if (dontAttackTargetTpyes.includes(targetTypes.ENEMY) && listEnemies.includes(tokenKey)){
                    return
                } 
                if(dontAttackTargetTpyes.includes(targetTypes.SELF) && tokenKey == tokenID){
                    return;
                } 
            }
            if(target[0] = tokenTypes.CHARACTER){
                const targetRect = target[1];
                const targetShape = getTokenShape(targetRect, tokenShapeTypes.HEXAGON);
                let isOverlapping;
                
                if (spell.spellPattern.pattern == spellPatterns.CIRCULAR) {
                    isOverlapping = isCircleOverlap(corners, targetShape);   
                } else {
                    isOverlapping = isOverlap(corners, angle, rotationCenterX, rotationCenterY, targetShape);
                }

                if (isOverlapping) {
                    if (!overlappedTokens.get(tokenKey)) {
                        overlappedTokens.set(tokenKey, true);
                        highlightToken(tokenKey);
                    }
                } else {
                    removeHighlight(tokenKey);
                }
            }          
        });
    }

    gameboard.addEventListener('mousemove', updatePosition);

    function stopCasting() {
        if(spell.type == spellTypes.CONJURE){
            if(overlappedTokens.size == 0) {
                const img = document.createElement('img');
                img.src = allFilePaths.folderCharToken + '/' + spell.damage + '/' + 'char.png';
                img.id = spell.damage;
                createCharacterToken(img, mouse.x, mouse.y, characterTypes.CONJURED, "token-character-"+char.id);        
            }else{
                return;
                // overlappedTokens.forEach((_, tokenKey) => {
                //     removeHighlight(tokenKey);
                // });  
            }
        }else{
            console.log(overlappedTokens);
            if(overlappedTokens.size > 0) {
                calculateAttackerRolls(spell, tokenID, mana, distance);
                overlappedTokens.forEach((_, tokenKey) => {
                    removeHighlight(tokenKey);
                });         
            }
        }
        
        char.action = characterActions.CASTED;
        bgLayer.removeChild(spellCastTarget);
        bgLayer.removeChild(spellRangeCircle);
        // removeTestDots(bgLayer, out);
        gameboard.removeEventListener('mousemove', updatePosition);
        gameboard.removeEventListener('click', stopCasting);
    }

    setTimeout(() => {
        gameboard.addEventListener('click', stopCasting);
    }, 250);

    function highlightToken(tokenId) {
        const tokenElement = document.getElementById(tokenId);
        if (tokenElement && !tokenElement.classList.contains('highlight')) {
            const highlightDiv = document.createElement('div');
            highlightDiv.classList.add('highlight-overlay');
            tokenElement.appendChild(highlightDiv);
        }
    }

    function removeHighlight(tokenId) {
        const tokenElement = document.getElementById(tokenId);
        if (tokenElement) {
            const highlightDiv = tokenElement.querySelector('.highlight-overlay');
            if (highlightDiv) {
                tokenElement.removeChild(highlightDiv);
                overlappedTokens.delete(tokenId);
            }
        }
    }
}

function getAdditionalEffectBonuses(additionalEffectList, onAction = characterActions.CASTING, targetEffectType = additionalEffectTypes.BUFF, effecTypesList){
    let valueDict = new Map();

    if(effecTypesList){ // BUFF SEARCH
        for (const effectType of effecTypesList){
            valueDict.set(effectType, []);
        }
    } else{ // AURA OR CAST SEARCH
        valueDict.set(1, []);
    }

    for (const additionalEffect of additionalEffectList){
        if (additionalEffect.characterAction.includes(onAction)){
            additionalEffect.effects.forEach((effect) =>{
                if(effect.type == targetEffectType){
                    if(effect.type == additionalEffectTypes.BUFF){
                        if(effecTypesList.includes(effect.effectType)){
                            let arr = valueDict.get(effect.effectType); 
                            arr.push(effect.value);
                        }
                    }
                }else{
                    return;
                }
            })
        }
    }

    return valueDict;
}

function calculateAttackerRolls(spell, characterId, mana, distance) {
    // FUTURE distance ı nasıl eklicem? Heelp
    let dice = spell.damage;

    const char = inGameChars.get(characterId);

    if(mana == spell.spellLevel){
        console.log(`Spell Base Damage: ${spell.damage}`);
        return;
    }
    const allBuffsFromSpell = getAdditionalEffectBonuses(spell.spendManaEffects[mana].caster, characterActions.CASTING, additionalEffectTypes.BUFF, [effectTypes.ATTACK_DAMAGE_BONUS, effectTypes.DICE_CHANGE]);
    const allBuffsFromChar = getAdditionalEffectBonuses(char.additionalEffects, characterActions.CASTING, additionalEffectTypes.BUFF, [effectTypes.ATTACK_DAMAGE_BONUS, effectTypes.DICE_CHANGE]);

    const allAttackBuffs = [...allBuffsFromSpell.get(effectTypes.ATTACK_DAMAGE_BONUS),...(allBuffsFromChar.get(effectTypes.ATTACK_DAMAGE_BONUS))]
    
    const allAurasFromSpell = getAdditionalEffectBonuses(spell.spendManaEffects[mana].caster, characterActions.CASTING, additionalEffectTypes.AURA, [effectTypes.ATTACK_DAMAGE_BONUS, effectTypes.DICE_CHANGE]);
    const allAurasFromChar = getAdditionalEffectBonuses(char.additionalEffects, characterActions.CASTING, additionalEffectTypes.AURA, [effectTypes.ATTACK_DAMAGE_BONUS, effectTypes.DICE_CHANGE]);

    const allAuras = [...allAurasFromSpell.get(effectTypes.ATTACK_DAMAGE_BONUS),...(allAurasFromChar.get(effectTypes.ATTACK_DAMAGE_BONUS))]

    const allCastsFromSpell = getAdditionalEffectBonuses(spell.spendManaEffects[mana].caster, characterActions.CASTING, additionalEffectTypes.CAST, [effectTypes.ATTACK_DAMAGE_BONUS, effectTypes.DICE_CHANGE]);
    const allCastsFromChar = getAdditionalEffectBonuses(char.additionalEffects, characterActions.CASTING, additionalEffectTypes.CAST, [effectTypes.ATTACK_DAMAGE_BONUS, effectTypes.DICE_CHANGE]);

    const allCasts = [...allCastsFromSpell.get(effectTypes.ATTACK_DAMAGE_BONUS),...(allCastsFromChar.get(effectTypes.ATTACK_DAMAGE_BONUS))]

    const FOR_PRINT = true;
    if(FOR_PRINT){
        const spellBuffs = allBuffsFromSpell.get(effectTypes.ATTACK_DAMAGE_BONUS).reduce((sum, bonus) => sum + ` + ${getKeyFromMapWithValue(damageType, bonus[0])} ${bonus[1]}`, '');
        const charBuffs  = allBuffsFromChar.get(effectTypes.ATTACK_DAMAGE_BONUS).reduce((sum, bonus) => sum + ` + ${getKeyFromMapWithValue(damageType, bonus[0])} ${bonus[1]}`, '');

        const attackBonus = spellBuffs != '' ? spellBuffs: '' + charBuffs != '' ? charBuffs: '';

        const diceChange = allBuffsFromSpell.get(effectTypes.DICE_CHANGE);
        if (diceChange.length > 0) {
            dice = diceChange[0];
        }

        dice += (attackBonus != '') ? attackBonus : "";

        let charBonus;
        let logPrint = "";

        for (const rollType of spell.casterRolls) {
            if (rollType === rollTypes.INT_SAVING_THROW) {
                const key = getKeyFromMapWithValue(rollTypes, rollTypes.INT_SAVING_THROW);
                logPrint += `${key}, `;
                charBonus = Math.round((char.int - 10) / 2); 
            }
        }

        // Remove trailing comma and space from logPrint
        logPrint = logPrint.slice(0, -2);

        console.log(`Spell Base Damage: ${spell.damage}, Bonus: ${attackBonus}, Dice: ${getKeyFromMapWithValue(damageTypes, spell.damageType)} ${dice}, Caster Rolls: ${logPrint} with bonus ${charBonus}`);
    }
    
    return [allCasts, allAuras, allAttackBuffs, spell.targetRolls];
}


function calculateTargetRolls(characterId, damageTypes, rolls, attackerDamage, targetEffects){
  
}
