export const INNLEDENDE = 1;
export const SEMI = 2;
export const FINALE = 3;

export function resultComparator(stageid) {
    return (a, b) => {
        const scoreA = a.totalAt(stageid);
        const scoreB = b.totalAt(stageid);
        if (scoreA !== scoreB) {
            return scoreB - scoreA; // Descending order
        }
        return b.get('n9') - a.get('n9') ||
               b.get('n8') - a.get('n8') ||
               b.get('n7') - a.get('n7') ||
                b.get('n6') - a.get('n6') ||
                b.get('n5') - a.get('n5') ||
                b.get('n4') - a.get('n4') ||
                b.get('n3') - a.get('n3') ||
                b.get('n2') - a.get('n2') ||
                b.get('n1') - a.get('n1');
    };
}