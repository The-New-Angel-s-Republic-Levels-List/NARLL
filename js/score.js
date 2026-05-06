//num of decimal digits to round to
const scale = 2;

export function score(rank, percent) {
    rank = Number(rank);
    percent = Number(percent);

    if (isNaN(rank) || isNaN(percent)) return 0;
    if (rank > 50) return 0;

    // anchor points for customizable curve !!
    const anchors = [
        { r: 1, s: 100 },
        { r: 10, s: 70 },
        { r: 20, s: 40 },
        { r: 30, s: 20 },
        { r: 40, s: 10 },
        { r: 50, s: 1 }
    ];

    let base = 0;

    // find seg and interpolate shit
    for (let i = 0; i < anchors.length - 1; i++) {
        let a = anchors[i];
        let b = anchors[i + 1];

        if (rank >= a.r && rank <= b.r) {
            let t = (rank - a.r) / (b.r - a.r);
            base = a.s + t * (b.s - a.s);
            break;
        }
    }

    // percent scaling
    let score = base * (percent / 100);

    // OPTIONAl penalty for incomplete
    if (percent !== 100) {
        score -= score / 3;
    }

    return round(score);
}

export function round(num) {
    if (isNaN(num)) return 0;
    return Math.round(num * 100) / 100;
}
//SCRUFFIE WAS HERE :3
//MOLD ADDED ANCHOR POINTS HERE :3