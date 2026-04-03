/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

//REMOVE MINPERCENT
/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @returns {Number}
 */

//UPDATED SCORE FUNCTION
export function score(rank, percent) {
    rank = Number(rank);
    percent = Number(percent);

    //if statement cleanup
    if (isNaN(rank) || isNaN(percent)) return 0;
    if (rank > 50) return 0;

    //list formula
    let base = 1 + 99 * Math.pow(1 - (rank - 1) / 49, 2.1);
    let score = base * (percent / 100);

    score = Math.max(0, Math.min(100, score));

    if (percent !== 100) {
        score -= score / 3;
    }

    return round(score);
}

export function round(num) {
    //RETURN 0 IF NAN
    if (isNaN(num)) return 0;

    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        var arr = ('' + num).split('e');
        var sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
//SCRUFFIE WAS HERE :3