// Helper methods that manipulate strings

export let getLetters = (str: string): string[] => str.split('');
export let getWords = (str: string): string[] => str.split(' ');

// function that accepts a string and returns it as plural
// if the string is two words, it only does this for the 2nd word - reporting agencies
// if the string is three words it does this for the 1st and 3rd - Cities or Counties

export function pluralize(text: string): string {
    if (!text || text.split('').length === 0 || text === undefined) {
        return text;
    }
    // inner methods
    let setAsPlural = (letters: string[]): string => {
        let last = letters[letters.length - 1];
        if (last === 'y') {
            letters.pop();
            letters.push('ies');
        }
        else {
            letters.push('s');
        }
        return letters.join('');
    };

    let words = getWords(text);
    let textHasWords = words.length > 1;

    if (!textHasWords) {
        return setAsPlural(getLetters(words[0]));
    }
    else {
        // the assumption here is we are getting something like
        // 'City or County' or 'FHP Troop'
        // if 3 words - pluralize first and last
        // if 2 words only pluralize last;
        if (words.length === 3) {
            words.forEach((word, i) => {
                if (i !== 1) {
                    word = setAsPlural(getLetters(word));
                }
            });
        }
        else if (words.length === 2) {
            words[1] = setAsPlural(getLetters(words[1]));
        }
        return words.join(' ');
    }
}

// returns hyphenated string as spaced string
export function splitOnHyphens(str: string): string {
    return str.split('-').join(' ');
}


// as we identify acronymns that should be in caps
// add them to the array acronymns
export function captitalizeAcronymns(str: string): string {
    let acronymns = ['pd', 'le', 'so', 'fhp', 'hsmv', 'cmv', 'am', 'pm'];
    return getWords(str).map((word) => {
        if (acronymns.includes(word.toLowerCase())) {
            return word.toUpperCase();
        }
        return word;
    }).join(' ');
}
export function lowercaseConjunctions(str: string): string {
    let conjunctions = ['and', 'or', 'for', 'nor', 'but', 'yet'];
    return getWords(str).map((word) => {
        if (conjunctions.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        return word;
    }).join(' ');
}

export function titleCase(str: string): string {
    let editString = str.toLowerCase();
    let capFirstLetter = (word: string) => {
        let letters = getLetters(word);
        letters[0] = letters[0].toUpperCase();
        return letters.join('');
    };

    return lowercaseConjunctions(captitalizeAcronymns(getWords(editString).map((word: string) => {
        return capFirstLetter(word);
    }).join(' ')));


}
