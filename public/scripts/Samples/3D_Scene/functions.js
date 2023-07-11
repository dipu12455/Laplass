// Generate a random number between min (inclusive) and max (exclusive)
export function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Generate a random integer between min (inclusive) and max (inclusive)
export function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}