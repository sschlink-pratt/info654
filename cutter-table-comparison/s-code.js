function getSCode() {
    const sNumberEl = document.getElementById('s-code');
    const author = document.getElementById('author').value
        .toUpperCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, '');
    const lengthInput = document.getElementById('total-cutter-length');
    let numberOfCharactersToDisplay = parseInt(lengthInput.value, 10);

    if (author.length < 2) {
        sNumberEl.innerHTML = "";
        return '';
    }
    let sCode = author[0] + getSecondCharSCode(author[0], author[1]);

    let nextCharacterToProcess = 2;
    for (let i = nextCharacterToProcess; i < author.length; i++) {
        sCode += getAdditionalChar(author[i]);
    }
    // If user requests more characters than we have...
    if (sCode.length < numberOfCharactersToDisplay) {
        // reset numberOfCharactersToDisplay to the length of our code.
        numberOfCharactersToDisplay = sCode.length;
    }
    sNumberEl.innerHTML = sCode.substring(0, numberOfCharactersToDisplay);
}
// C => 3
function asNum(letter) {
    return letter.charCodeAt(0) - 64;
}
function getSecondCharSCode(firstChar, secondChar) {
    let secondCharNum = asNum(secondChar);
    // Thinking of more concise ways to represent this information, since for
    // SCube, we're going to have 676 (26^2) of them.
    // b_map = "12222333344455566677899999"; // Banerjee form
    // b_map_as_steps = [1,4,4,3,3,3,2,1,5]; // my shower idea
    // Regardless, we'd need a killer function that would take handle it well. Easy?

    // Here's a wild way!
    // let code = 0;
    // if (num >= 1) code += 1;
    // if (num >= 5) code += 1;
    // if (num >= 9) code += 1;
    // if (num >= 12) code += 1;
    // if (num >= 15) code += 1;
    // if (num >= 18) code += 1;
    // if (num >= 20) code += 1;
    // if (num >= 21) code += 1;
    // if (num >= 26) code += 1;

    // How I had done first letter B
    // if (secondCharNum == 1) { return "1"; }
    // if ((2 <= secondCharNum) && (secondCharNum <= 5)) {return "2";}
    // if ((6 <= secondCharNum) && (secondCharNum <= 9)) { return "3"; }
    // if ((10 <= secondCharNum) && (secondCharNum <= 12)) { return "4"; }
    // if ((13 <= secondCharNum) && (secondCharNum <= 15)) { return "5"; }
    // if ((16 <= secondCharNum) && (secondCharNum <= 18)) { return "6"; }
    // if ((19 <= secondCharNum) && (secondCharNum <= 20)) { return "7"; }
    // if (secondCharNum === 21) { return "8"; }
    // if ((22 <= secondCharNum) && (secondCharNum <= 26)) { return "9"; }

    // I got the idea of representing the look-up tables directly as JS arrays from 
    // Kyle Banerjee's Cataloging Calculator 
    // https://github.com/banerjek/cataloging-calculator/blob/master/cutter.js#L71 
    let lookUpTables = {
         "A" : [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 6, 6, 6, 6, 7, 8, 8, 8, 8, 9, 9, 9],
         "B" : [1, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9],
         "C" : [1, 2, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 6, 6, 6, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "D" : [1, 2, 2, 2, 2, 3, 4, 4, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 9, 9, 9, 9],
         "E" : [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 6, 6, 6, 6, 7, 8, 8, 8, 9, 9, 9, 9],
         "F" : [1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 6, 6, 6, 7, 8, 8, 9, 9, 9, 9, 9],
         "G" : [1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 9, 9, 9, 9],
         "H" : [1, 2, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "I" : [1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 5, 6, 7, 8, 8, 8, 9, 9, 9],
         "J" : [1, 2, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "K" : [1, 2, 2, 2, 2, 3, 3, 3, 4, 5, 5, 5, 5, 5, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9],
         "L" : [1, 2, 3, 3, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "M" : [1, 2, 3, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "N" : [1, 2, 3, 3, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "O" : [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 6, 7, 8, 8, 8, 8, 9, 9],
         "P" : [1, 2, 3, 3, 3, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "Q" : [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 9],
         "R" : [1, 2, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 7, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "S" : [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 9, 9, 9, 9, 9],
         "T" : [1, 2, 3, 3, 3, 3, 3, 3, 4, 5, 5, 5, 5, 5, 5, 6, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9],
         "U" : [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 8, 8, 9, 9, 9],
         "V" : [1, 2, 3, 3, 4, 5, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9],
         "W" : [1, 2, 3, 3, 3, 4, 5, 5, 5, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],
         "X" : [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 9],
         "Y" : [1, 2, 3, 4, 4, 4, 4, 4, 4, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 8, 9, 9, 9, 9],
         "Z" : [1, 2, 3, 3, 3, 4, 4, 4, 5, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9],    
    };
    return lookUpTables[firstChar][secondCharNum];
}

function getAdditionalChar(char) {
    // I just used the K map here
    let sAdditionalCharsMap = [1, 2, 2, 2, 2, 3, 3, 3, 4, 5, 5, 5, 5, 5, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 9, 9];
    return sAdditionalCharsMap[asNum(char)];
}