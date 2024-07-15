import Serialiser from "./serializer.js";

const DEFAULT_MIN_VAL = 1;
const DEFAULT_MAX_VAL = 300;

const TESTS_CONFIG = [
    { minVal: DEFAULT_MIN_VAL, maxVal: DEFAULT_MAX_VAL, length: 50},
    { minVal: DEFAULT_MIN_VAL, maxVal: DEFAULT_MAX_VAL, length: 100},
    { minVal: DEFAULT_MIN_VAL, maxVal: DEFAULT_MAX_VAL, length: 500},
    { minVal: DEFAULT_MIN_VAL, maxVal: DEFAULT_MAX_VAL, length: 1000},
    { minVal: 1, maxVal: 9, length: 1000},
    { minVal: 10, maxVal: 99, length: 1000},
    { minVal: 100, maxVal: 300, length: 1000},
    { description: `Numbers from ${DEFAULT_MIN_VAL} up to ${DEFAULT_MAX_VAL} by 3 duplicates`, numbers: getAllNumbersDuplicated() }
]


function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAllNumbersDuplicated(duplicatesNum) {
    const numbers = [];

    for(let number = DEFAULT_MIN_VAL; number < DEFAULT_MAX_VAL; number++) {
        let duplicateAdded = 0;

        while(duplicateAdded < duplicatesNum) {
            numbers.push(number);
            duplicateAdded++;
        }
    }

    return numbers;
}

function fillArrayWithRandomInts(minVal, maxVal, length) {
    const testArray = [];

    while(testArray.length < length)
        testArray.push(getRandomIntBetween(minVal, maxVal))

    return testArray;
}

function checkArraysMatches(firstArray, secondArray) {
    return !firstArray.find((value, index) => secondArray[index] !== value)
}

function runTest(options) {
    const { numbersArray = null, minVal = DEFAULT_MIN_VAL, maxVal = DEFAULT_MAX_VAL, length = 1000, description = false } = options;
    const serializer = new Serialiser(Number(maxVal));
    const testArray = numbersArray || fillArrayWithRandomInts(Number(minVal), Number(maxVal), Number(length));
    const testDescription = description || `Min value: ${minVal}, Max value: ${maxVal}, Array length: ${testArray.length}`;
    const originalString = testArray.join(',');

    console.log(`\nTest start: ${testDescription}`);
    console.log(`    Original string length: ${originalString.length}`);

    const encodedString = serializer.serialize(testArray);
    const coefficient = (100 - (encodedString.length / originalString.length) * 100).toFixed(2);

    console.log(`    Encoded string length: ${encodedString.length}`);
    console.log(`    Compression efficiency: ${coefficient}%`);

    const decodedString = serializer.deserialize(encodedString);
    
    console.log(`    Is decoded array matches original: ${checkArraysMatches(testArray, decodedString)}`)
}

function runDefaultTests() {
    TESTS_CONFIG.forEach(data => runTest(data));
}

function run() {
    const args = process.argv.slice(2);

    if(!args.length) {
        runDefaultTests();
        return;
    }
    
    const options = {};

    args.forEach(arg => {
        const [key, val] = arg.split('=');
        options[key] = val;
    })

    runTest(options);
}

run();
