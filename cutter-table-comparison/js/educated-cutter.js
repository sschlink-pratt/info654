// These ranges (a) should be compatible with the procedure described
// in G 63 and (b) should be relatively optimized for equal buckets, 
// using a letter frequency analysis I did with a (different) program.
const educatedCutterTables = {
                      //ABCDEFGHIJKLMNOPQRSTUVWXYZ    
    "initialVowel":    "22333334444445666788999999",
    "initialS":        "22344445555566667777899999",
    "otherConsonants": "34444555555666677777888899",
    "additional":      "33334444555566677778889999",
    "Qu":              "33334444555555666778888899",
}
const VOWELSFORECODES = new Set(['A', 'E', 'I', 'O', 'U']);

// C => 3
function asIndexECode(letter) {
    return Number(letter.charCodeAt(0) - 64 - 1);
}
// Replace accented characters, convert to upper case, and 
// remove punctuation and white space from text inputted name
function cleanName(name) {
    let unaccentedName = replaceAccents(name);
    return unaccentedName.toUpperCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, '');
}
// Replace accented characters with their Roman "equivalents",
// so ä, á, å all become "a", as per LC G 100 https://loc.gov/aba/publications/FreeCSM/G100.pdf
function replaceAccents(str) {
    return str
        .replace("ø", "o")
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getSecond(author) {
    if (author.slice(0, 3) == "SCH") {
        return 3;
    }
    if (VOWELSFORECODES.has(author[0])) {
        return educatedCutterTables["initialVowel"][asIndexECode(author[1])];
    }
    if (author[0] == "S") {
        return educatedCutterTables["initialS"][asIndexECode(author[1])];
    }
    if (author.slice(0, 2) == "QU") {
        return educatedCutterTables["Qu"][asIndexECode(author[2])];
    }
    // Consonant 
    if (VOWELSFORECODES.has(author[0]) === false) {
        return educatedCutterTables["otherConsonants"][asIndexECode(author[1])];
    }
}

function getAdditionalECodes(author) {
    let additionals = "";
    if (author.length < 3) {
        return "";
    }
    let nextCharacterToProcessECode = 2;
    if (author.slice(0, 3) == "SCH") {
        nextCharacterToProcessECode = 3;
    }
    if (author.slice(0, 2) == "QU") {
        nextCharacterToProcessECode = 3;
    }
    for (let i = nextCharacterToProcessECode; i < author.length; i++) {
        let thisLetterAsIndexECode = asIndexECode(author[i]);
        additionals += educatedCutterTables["additional"][thisLetterAsIndexECode];
    }
    return additionals;
}

function getECode() {
    const eCodeEl = document.getElementById('e-code');
    const author = cleanName(document.getElementById('author').value);
    const lengthInput = document.getElementById('total-cutter-length');
    let numberOfCharactersToDisplay = parseInt(lengthInput.value, 10);

    if (author.length == 0){
       eCodeEl.innerHTML = "";
       return ''; 
    }
    if (author.length < 2) {
        eCodeEl.innerHTML = author[0];
        return '';
    }

    let eCode = author[0] + getSecond(author);
    eCode += getAdditionalECodes(author);

    // If user requests more characters than we have...
    if (eCode.length < numberOfCharactersToDisplay) {
        numberOfCharactersToDisplay = eCode.length;
    }
    eCodeEl.innerHTML = eCode.substring(0, numberOfCharactersToDisplay);
}