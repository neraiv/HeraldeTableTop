// const effectTypes = Object.freeze({
//     DICE_CHANGE: 1,
//     ATTACK_DAMAGE_BONUS: 2,
//     ATTACK_RADIUS_BONUS: 3, // Adjusted for consistency
//     ATTACK_RANGE: 4,        // Moved ATTACK_RANGE to follow ATTACK_RADIUS_BONUS
//     ATTACK_RANGE_BONUS: 5,  // Adjusted to be sequential
//     PATTERN_CHANGE: 6,      // Adjusted to follow ATTACK_RANGE_BONUS
//     HEAL: 7,
//     DEFENSE: 8,
//     VISION_RANGE_BONUS: 9,   // Adjusted to be in sequential order
// });



const listDuration = Object.freeze({
    INSTANT: new Duration(),
    TURN_BASED: new Duration(durationTypes.TURN_BASED)
});

const listBuffs = {
    DICE_CHANGE: new BuffDebuff("Dice Change", listDuration.INSTANT, effectTypes.DICE_CHANGE, null, null, "Changes the dice to be rolled."),
    ATTACK_DAMAGE_BONUS: new BuffDebuff("Attack Damage Bonus", null, null, null, null, null)
}