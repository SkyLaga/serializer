const CHUNK_LENGTH = 6;
const UNPRINTABLE_CHARS_LENGTH = 32;

export default class Serialiser {
    /**
     * 
     * @param {Number} maxVal 
     */
    constructor(maxVal) {
        this._binaryWidth = this._getBinaryWidth(maxVal);
    }

    /**
     * Get binary width to code one integer
     * @param {number} maxValue 
     * @returns {number}
     */
    _getBinaryWidth(maxValue) {
        let exponent = 1;

        while (Math.pow(2, exponent) < maxValue)
            exponent++;

        return exponent;
    }

    /**
     * Accepts array of integers as argument, returns serialized string.
     * @param {Number[]} array 
     * @returns {String}
     */
    serialize(array) {
        // transform array of integers into string of bites
        let binaryString = array.map(num => num.toString(2).padStart(this._binaryWidth, '0')).join('');

        let encodedString = '';
        const allChunksLength = binaryString.length + (CHUNK_LENGTH - binaryString.length % CHUNK_LENGTH);

        // filling uncompleted last chunk
        binaryString = binaryString.padEnd(allChunksLength, '0');

        // divide binary string to 6-digit chunks, each transforms to ASCII symbol which appends to result string
        for (let i = 0; i < binaryString.length; i += CHUNK_LENGTH) {
            const chunk = binaryString.substring(i, i + CHUNK_LENGTH);
            encodedString += String.fromCharCode(parseInt(chunk, 2) + UNPRINTABLE_CHARS_LENGTH);
        }

        return encodedString;
    }

    /**
     * Accepts string as argument, returns deserialized array of integers.
     * @param {String} encodedString 
     * @returns {Number[]}
     */
    deserialize(encodedString) {
        let binaryString = '';

        for (let char of encodedString) {
            binaryString += (char.charCodeAt(0) - 32).toString(2).padStart(CHUNK_LENGTH, '0');
        }

        const array = [];

        for (let i = 0; i < binaryString.length; i += this._binaryWidth) {
            const num = parseInt(binaryString.substring(i, i + this._binaryWidth), 2);

            if (num !== 0) {
                array.push(num);
            }
        }

        return array;
    }
}
