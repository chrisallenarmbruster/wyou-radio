function getRandomElement(arr) {
  if (!arr.length) {
    throw new Error("Array is empty!");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

module.exports = {
  getRandomElement,
};
