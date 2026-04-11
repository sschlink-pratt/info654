// From The Cataloging Calculator 
// https://catalogingcalculator.com/
// https://github.com/banerjek/cataloging-calculator/blob/master/cutter.js#L71
// by Kyle Banerjee

function getBanerjeeCutter() {
    const userinput = document.getElementById('author').value
        .toUpperCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, '');
    const lengthInput = document.getElementById('total-cutter-length');
    let numberOfCharactersToDisplay = parseInt(lengthInput.value, 10);

    var skip = 1;
    var tbl2arr = new Array();
    var tbl3arr = new Array();

    firstchar = userinput.substr(0, 1);
    secondchar = userinput.substr(1, 1);
    totallength = userinput.length;

    cutterval = firstchar;

    /* ****************************************
    Set up arrays determining which tables to use
    ****************************************** */

    valuelocator = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
    tablefinder  = "1444144414444414342414444455555555555";

    tbl2arr[1]   = "22233333333445566788999999XXXXXXXXXX"; // vowels. a-c => 2; d-k =>3; l-m=>4; n-o=>6; r => 7; s-t=>8; u-z=>9? 
    tbl2arr[2]   = "22334445555566666667899999XXXXXXXXXX"; // S. a-b=>2; c-d=>3*; e-g=>4; h-l=>5; m-s=>6; t=>7; u=>8; v-z=>9
    tbl2arr[3]   = "QQQQQQQQQQQQQQQQQQQQUUUUUUXXXXXXXXXX"; // Q. Not sure how this one works.
    tbl2arr[4]   = "33334444555555666777888899XXXXXXXXXX"; // Other consonant. a-d=>3; e-h=>4; i-n=>5; o-q =>6; r-t => 7; u-x => 8; y-z=>9
    tbl2arr[5]   = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    tbl3arr      = "33334444555566677778889999";           // Additional characters. a–d=>3;e–h=>4; i–l=>5; m–o=>6; p–s=>7; t–v=>8; w–z=>9
    validnumbers = "23456789Q";


    /* ******************************
    Locate correct table
     ****************************** */

    for (itable = 0; itable < 36; itable++) {
        if (valuelocator.substr(itable, 1) == userinput.substr(0, 1)) {
            whichtable = tablefinder.substr(itable, 1);
        }
    }

    /* **************************************
    Look up second character on correct table
    ***************************************** */

    for (iChar = 0; iChar < 36; iChar++) {
        if (valuelocator.substr(iChar, 1) == userinput.substr(1, 1)) {

            /* *****************************************************
            Get Cutter Value -- Accepts only values from 2-9
            ***************************************************** */
            nextdigit = tbl2arr[whichtable].substr(iChar, 1);

            for (x = 0; x < 9; x++) {
                if (nextdigit == validnumbers.substr(x, 1)) {
                    cutterval = cutterval + nextdigit;
                }
            }

        }
    }

    /* *****************
    Handle SCH exception
    ****************** */

    if (userinput.substr(0, 3) == "SCH") {
        cutterval = "S3";
    }


    /* *****************************
    Process third character onwards
    ****************************** */

    startCounter = 2;

    if (userinput.substr(0, 3) == "SCH") {
        startCounter++;
    }

    for (counter = startCounter; counter < totallength; counter++) {
        for (itable = 0; itable < 36; itable++) {

            if (valuelocator.substr(itable, 1) == userinput.substr(counter, 1)) {

                /* ******************************
                Get Cutter Value
                ****************************** */
                nextdigit = tbl3arr.substr(itable, 1);
                cutterval = cutterval + nextdigit;
            }
        }

    }


    /* **********************************************************
    Detect special cases. Otherwise, just return calculated value
    ************************************************************ */
    if (whichtable == 5) {
        cutterval = "Use A12 - A19 for numerals";
    }

    if (userinput.length > 2) {
        if (cutterval.substr(1, 1) == "U") {
            cutterval = "Q" + cutterval.substr(2);
        }
    }

    for (x = 1; x < cutterval.length; x++) {
        if (cutterval.substr(x, 1) == "Q") {
            cutterval = "Use 2 - 29 for Qa - Qt";
        }
    }

    // If user requests more characters than we have...
    if (cutterval.length < numberOfCharactersToDisplay) {
        // reset numberOfCharactersToDisplay to the length of our code.
        numberOfCharactersToDisplay = cutterval.length;
    }
    document.getElementById('banerjee-code').innerHTML = cutterval.substring(0, numberOfCharactersToDisplay);

}