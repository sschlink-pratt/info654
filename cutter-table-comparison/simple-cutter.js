const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Assign numbers to each letter in the alphabet, which will help
// when dealing with RANGES of letters later.
// A => 1, B => 2, etc.
const LETTER_VALUES = {};
for (let i = 0; i < ALPHABET.length; i++) {
    LETTER_VALUES[ALPHABET[i]] = i + 1;
}

// A little helper function that, given a letter, given its assigned number
function asNum(letter) {
    return LETTER_VALUES[letter] || 0;
}

function getSecondCharCutter(firstCharNum, secondCharNum, author) {
    const firstChar = String.fromCharCode(firstCharNum + 64);

    // Special case: S followed by CH
    if ((firstCharNum === LETTER_VALUES['S']) && (secondCharNum == LETTER_VALUES['C'])) {
        if (author[2] === 'H') return '3';
    }
    // Special case: "Qu" effectively has no second Cutter character
    if ((author.length == 2) && (firstCharNum === LETTER_VALUES['Q']) && (secondCharNum == LETTER_VALUES['U'])) {
        return '';
    }

    // Handle the more regular S cases
    if (firstCharNum === LETTER_VALUES['S']) {
        if (secondCharNum === LETTER_VALUES['A']) return '2';
        if (secondCharNum === LETTER_VALUES['E']) return '4';
        if (secondCharNum === LETTER_VALUES['C']) return ''; // Handled above
        if (inRange(secondCharNum, LETTER_VALUES['H'], LETTER_VALUES['I'])) return '5';
        if (inRange(secondCharNum, LETTER_VALUES['M'], LETTER_VALUES['P'])) return '6';
        if (secondCharNum === LETTER_VALUES['T']) return '7';
        if (secondCharNum === LETTER_VALUES['U']) return '8';
        if (inRange(secondCharNum, LETTER_VALUES['W'], LETTER_VALUES['Z'])) return '9';
    }

    // Handle case where first "letter" is Q+U
    const isQU = ((firstCharNum === LETTER_VALUES['Q']) && (secondCharNum === LETTER_VALUES['U']));
    if (isQU) {
        const map = {
            'A': '3',
            'E': '4',
            'I': '5',
            'O': '6',
            'R': '7',
            'U': '8',
            'Y': '9'
        };
        // If the firstChar is "QU", the secondChar is actually the THIRD character in the string
        const secondChar = author[2];
        return map[secondChar] || '';
    }

    const isNonVowel = !VOWELS.has(firstChar);
    if (isNonVowel) {
        const map = {
            'A': '3',
            'E': '4',
            'I': '5',
            'O': '6',
            'R': '7',
            'U': '8',
            'Y': '9'
        };
        const secondChar = String.fromCharCode(secondCharNum + 64);
        return map[secondChar] || '';
    }

    // Handle case where first letter is a vowel
    if (VOWELS.has(firstChar)) {
        if (secondCharNum === LETTER_VALUES['B']) return '2';
        if (secondCharNum === LETTER_VALUES['D']) return '3';
        if (inRange(secondCharNum, LETTER_VALUES['L'], LETTER_VALUES['M'])) return '4';
        if (secondCharNum === LETTER_VALUES['N']) return '5';
        if (secondCharNum === LETTER_VALUES['P']) return '6';
        if (secondCharNum === LETTER_VALUES['R']) return '7';
        if (inRange(secondCharNum, LETTER_VALUES['S'], LETTER_VALUES['T'])) return '8';
        if (inRange(secondCharNum, LETTER_VALUES['U'], LETTER_VALUES['Y'])) return '9';
    }

    // No explicit second character!! 
    // Handle this issue later!
    return '';
}

function inRange(value, min, max) {
    return value >= min && value <= max;
}

// Map additional characters to numbers (A-D=3, E-H=4, etc.)
const ADDITIONAL_CHAR_MAP = [{
        range: ['A', 'D'],
        value: '3'
    },
    {
        range: ['E', 'H'],
        value: '4'
    },
    {
        range: ['I', 'L'],
        value: '5'
    },
    {
        range: ['M', 'O'],
        value: '6'
    },
    {
        range: ['P', 'S'],
        value: '7'
    },
    {
        range: ['T', 'V'],
        value: '8'
    },
    {
        range: ['W', 'Z'],
        value: '9'
    }
];

function getAdditionalCharCutter(charNum) {
    for (const {
            range,
            value
        }
        of ADDITIONAL_CHAR_MAP) {
        if (inRange(charNum, LETTER_VALUES[range[0]], LETTER_VALUES[range[1]])) {
            return value;
        }
    }
    return '';
}

// Main function
function getCutter() {
    const cutterNumberEl = document.getElementById('cutter-number');
    const authorInput = document.getElementById('author');
    const lengthInput = document.getElementById('total-cutter-length');

    // Early return if no author
    cutterNumberEl.innerHTML = '<br>';

    // Make author name uppercase, than remove any and all punctuation and spaces.
    const author = authorInput.value.toUpperCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, '');
    // If author is now empty, return nothing now.
    if (!author) return;

    let numberOfCharactersToDisplay = parseInt(lengthInput.value, 10);

    if (numberOfCharactersToDisplay <= 0) return;

    const authorAsNumbers = author.split('').map(char => asNum(char));
    // Cutter code starts as first letter of the author's name
    let cutterCode = author[0];

    // If user only wants a Cutter code length of 1, or the author's name is only one character
    // we're done!
    if ((numberOfCharactersToDisplay === 1) || (author.length === 1)) {
        cutterNumberEl.innerHTML = cutterCode;
        return;
    }

    // Process second character
    let secondCharacter = getSecondCharCutter(authorAsNumbers[0], authorAsNumbers[1], author);
    // if we get a secondCharacter
    if (secondCharacter != '') {
        // ... add it to our growing cutterCode
        cutterCode += secondCharacter;
        // Now figure out which character we're going to process next.
        // This isn't pretty, but basically if we had a corner case of a QU or SCH, where the first
        // "additional" character to process is NOT the third letter of the string, but the 4th!
        if ((authorAsNumbers[0] === LETTER_VALUES['Q']) && (authorAsNumbers[1] === LETTER_VALUES['U'])) {
            nextCharacterToProcess = 3;
        } else if ((authorAsNumbers[0] === LETTER_VALUES['S']) && (authorAsNumbers[1] === LETTER_VALUES['C']) && (authorAsNumbers[2] === LETTER_VALUES['H'])) {
            nextCharacterToProcess = 3;
        } else {
            var nextCharacterToProcess = 2;
        }
    } else {
        // If we did NOT get a secondCharacter, we now have to process the 2nd character
        // using the additional letters table.
        var nextCharacterToProcess = 1;
    }

    // Process additional characters (regardless of whether user asked for them -- we'll
    // take the efficiency hit!)
    for (let i = nextCharacterToProcess; i < authorAsNumbers.length; i++) {
        cutterCode += getAdditionalCharCutter(authorAsNumbers[i]);
    }

    // If user requests more characters than we have...
    if (cutterCode.length < numberOfCharactersToDisplay) {
        // reset numberOfCharactersToDisplay to the length of our code.
        numberOfCharactersToDisplay = cutterCode.length;
        // Since we're effectively ignoring/overwriting the user's desired length
        // as entered, we'll grey it out to signal that
        document.getElementById("desired-length").style.color = "#CCC";
    } else {
        // If we are able to display their desired amount of characters,
        // make the text black again.
        document.getElementById("desired-length").style.color = "#000";
    }
    // Finally, write the desired number of characters of the cutterCode
    // to the HTML element.
    cutterNumberEl.innerHTML = cutterCode.substring(0, numberOfCharactersToDisplay);
}