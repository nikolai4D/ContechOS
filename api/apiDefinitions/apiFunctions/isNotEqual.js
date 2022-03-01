async function isNotEqual(value1, value2, res) {
  if (value1 === value2) {
    res.status(400).json("same values not allowed");
    return false;
  } else {
    return true;
  }
}
module.exports = isNotEqual;
