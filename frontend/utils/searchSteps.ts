// Dynamic step configuration based on filter type
export const getStepsForFilter = (filter: 'reisen' | 'fluege' | 'unterkunft' | 'transfer') => {
    switch (filter) {
        case 'reisen':
            return [
                { number: 1, title: 'Wohin?', subtitle: 'Wähle dein Traumziel' },
                { number: 2, title: 'Wann?', subtitle: 'Reisezeitraum festlegen' },
                { number: 3, title: 'Wer?', subtitle: 'Anzahl der Reisenden' }
            ];
        case 'fluege':
            return [
                { number: 1, title: 'Von/Nach', subtitle: 'Flugstrecke auswählen' },
                { number: 2, title: 'Wann?', subtitle: 'Flugdaten festlegen' },
                { number: 3, title: 'Wer?', subtitle: 'Anzahl der Passagiere' }
            ];
        case 'unterkunft':
            return [
                { number: 1, title: 'Wohin?', subtitle: 'Reiseziel auswählen' },
                { number: 2, title: 'Wann?', subtitle: 'Aufenthaltszeitraum' },
                { number: 3, title: 'Wer?', subtitle: 'Anzahl der Gäste' }
            ];
        case 'transfer':
            return [
                { number: 1, title: 'Transfer-Typ', subtitle: 'Hinfahrt oder Hin- und Rückfahrt' },
                { number: 2, title: 'Details', subtitle: 'Von/Nach und Abholzeit' },
                { number: 3, title: 'Passagiere', subtitle: 'Anzahl und Gepäck' }
            ];
    }
};
