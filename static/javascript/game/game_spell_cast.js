
class BuffDebuff {
    constructor({effectType, value, duration = null, triggerActions= [characterActions.TURN_START]}, source_type = null, source = null) {
        this.effectType = effectType;
        this.value = value;
        this.duration = duration;
        this.triggerActions = triggerActions;

        // Below values assigned when someoen casts buff/debuff
        this.source_type = source_type; // EffectSource enum
        this.source = source; // Character ID or Object ID
    }
}

class Aura {
    constructor({area, effectType, value, duration = new Duration(), triggerActions, targetList = [targetTypes.ALLY], canSpread = false} = {}) {
        this.area = area;
        this.effectType = effectType;
        this.value = value
        this.duration = duration;
        this.triggerActions = triggerActions;  // CharacterAction enum
        this.targetList = targetList;  // Array of TargetType enum 0: ALLY, 1: ENEMY
        this.canSpread = canSpread
    }
}

class Summon {
    constructor({id, castDuration, summonDuration, quantity = 1, summonLocation = summonLocations.AROUND_CASTER} = {}) {
        this.id = id;  // Character ID
        this.castDuration = castDuration; // Duration of the spell cast
        this.summonDuration = summonDuration;
        this.quantity = quantity; // Number of summons
        this.summonLocation = summonLocation; // Location of the summon
    }
}

class Cast {
    constructor({spellName, mana, targetListInOrder, castTimes= 1} = {}) {

        this.spellName = spellName;  // Spell object
        this.mana = mana;
        this.targetListInOrder = targetListInOrder;
        this.castTimes = castTimes;
    }
}

class Effect {
    constructor({name, type, description, effect} = {}) {
        this.name = name;  // String
        this.type = type
        this.description = description
        this.effect = effect
    }
}

class ExtraEffects {
    constructor({
        DICE_CHANGE,
        ATTACK_DAMAGE_BONUS,
        ATTACK_RADIUS_BONUS,
        ATTACK_RANGE_BONUS,
        PATTERN_CHANGE,
        HEAL,
        DEFENSE,
        VISION_RANGE_BONUS,
        TAKE_DAMAGE,
        HASTE,
        DURATION,
    } = {
        DICE_CHANGE: 0,
        ATTACK_DAMAGE_BONUS: 0,
        ATTACK_RADIUS_BONUS: 0,
        ATTACK_RANGE_BONUS: 0,
        PATTERN_CHANGE: 0,
        HEAL: 0,
        DEFENSE: 0,
        VISION_RANGE_BONUS: 0,
        TAKE_DAMAGE: 0,
        HASTE: 0,
        DURATION: 0,
    }) {
        this.DICE_CHANGE = DICE_CHANGE;
        this.ATTACK_DAMAGE_BONUS = ATTACK_DAMAGE_BONUS;
        this.ATTACK_RADIUS_BONUS = ATTACK_RADIUS_BONUS;
        this.ATTACK_RANGE_BONUS = ATTACK_RANGE_BONUS;
        this.PATTERN_CHANGE = PATTERN_CHANGE;
        this.HEAL = HEAL;
        this.DEFENSE = DEFENSE;
        this.VISION_RANGE_BONUS = VISION_RANGE_BONUS;
        this.TAKE_DAMAGE = TAKE_DAMAGE;
        this.HASTE = HASTE;
        this.DURATION = DURATION;
    }
}

// I am not sure about below function
function getBuffDebuffExtra(effect = new BuffDebuff(), onAction = characterActions.CASTING){
    if(onAction in effect.triggerActions){
        const newEffect = new ExtraEffects()
        newEffect[dictFindValueName(effect.type)] = effect.value
        return 
    }else{
        return null;
    }
}

class SpellCast {
    constructor(tokenID, spellName, usedMana=0){
        this.tokenID = tokenID;
        this.spellName = spellName;
        this.usedMana = usedMana;
        this.modifiedSpellData = new Spell(database.spells[spellName]);
        this.tokenPosition = database.sceneData.chars[tokenID];
        this.tokenCharData = new Character(database.chars[tokenID]);
        this.castQueue = [];
    }

    checkInit(){
        if (!this.modifiedSpellData) {
            userWarn(`Spell ${this.spellName} not found.`);
            return;
        }
        if (!this.tokenPosition) {
            userWarn(`Token ${this.tokenID} not found.`);
            return;
        }
        if (!this.tokenCharData) {
            userWarn(`Character ${this.tokenID} not found.`);
            return;
        }
    }

    checkMana(){
        if (usedMana in this.tokenCharData.char.spellSlots){
            if (this.tokenCharData.char.spellSlots[mana].remaining > 0){ 
                return true;
            }
            return false;
        }
    }

    applyCharStatMultipliers(){

    }


    applyEffects(effects_list){
        for (const effect of effects_list) {
            if (effect instanceof BuffDebuff) {
                switch (effect.effectType) {
                    case effectTypes.ATTACK_AREA_BONUS:
                        this.modifiedSpellData.spellPattern.area += effect.value;
                        break;
                    case effectTypes.ATTACK_RANGE_BONUS:
                        this.modifiedSpellData.spellPattern.range += effect.value;
                        break;
                    case effectTypes.PATTERN_CHANGE:
                        this.modifiedSpellData.spellPattern = effect.value;
                        break;
                    case effectTypes.ATTACK_DAMAGE_BONUS || effectTypes.HEAL:
                        this.modifiedSpellData.damage.append(effect.value);
                        break;
                    case effectTypes.TAKE_DAMAGE:
                        this.tokenCharData.char.takeDamage(effect.value);
                        break;
                    case effectTypes.HASTE:
                        if (this.modifiedSpellData.castDuration.type == durationTypes.TURN){
                            const newDuration = this.modifiedSpellData.castDuration.type - effect.value;
                            if (newDuration <= 0) {   
                                this.modifiedSpellData.castDuration.type = durationTypes.INSTANT;
                            }else{
                                this.modifiedSpellData.castDuration.value = newDuration;
                            }
                        }
                        break;
                    default:
                        userWarn(`Unknown buff/debuff type: ${effect.effectType}`);
                }
            } else if (effect instanceof Aura) {
                this.tokenCharData.addAura(effect);
            } else if (effect instanceof Summon) {
                this.tokenCharData.addSummon(effect);
            } else if (effect instanceof Cast) {
                this.tokenCharData.addEffect(effect);
            } else {
                userWarn(`Unknown effect type: ${effect}`);
            }
        }
    }

    castSpell(){    
        this.checkInit();
        this.checkMana();
        // Get all effects from the spell
        const spellEffects = this.modifiedSpellData.getExtraEffects(this.usedMana);
        
        // Get all effects from the character
        const charEffects = this.tokenCharData.getExtraEffects(characterActions.CASTING);
        
        // Merge the effects
        
    }
}