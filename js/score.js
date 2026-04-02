/**
 * Numbers of decimal digits to round to
 */
const scale = 2;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 50) {
        return 0;
    }
    // Updated to match rank > 50 requirement
    if (rank > 50 && percent < 100) {
        return 0;
    }

    // New formula: =ROUND(1 + 99 * POWER(1 - (rank-1)/(50-1), 2.1), 2)
    // Note: (rank-1) replaces (ROW-3) to start at 0 for the first rank.
    let score = (1 + 99 * Math.pow(1 - (rank - 1) / (50 - 1), 2.1)) *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    score = Math.max(0, Math.min(100, score));

    if (percent != 100) {
        return round(score - score / 3);
    }

    return Math.max(round(score), 0);
}

export function round(num) {
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
