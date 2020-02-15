const endPhrasesModule = require("../resources/endPhrases.js");

const getTimefromTimestamp = timestamp => {
  var regex = /\T(.*?)\+/;
  var regTime = regex.exec(timestamp)[1];

  var timeArr = regTime.split(":");
  var onlySortedTime = timeArr.slice(0, -1).join(":");

  return onlySortedTime;
};

const getRandomNumber = max => {
  return Math.floor(Math.random() * max);
};

const radomEndPhrase = () => {
  const endPhrasesArr = endPhrasesModule.endPhrasesArr;

  const index = getRandomNumber(endPhrasesArr.length);

  const phrase = endPhrasesArr[index];

  return phrase;
};


module.exports.getTimefromTimestamp = getTimefromTimestamp;
module.exports.getRandomNumber = getRandomNumber;
module.exports.radomEndPhrase = radomEndPhrase;
