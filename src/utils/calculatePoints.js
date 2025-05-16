function CalculatePoints(ranking) {
  if (ranking <= 7 || ranking >= 9997) {
    const Rankings = {
      1: 8,
      2: 7,
      3: 6,
      4: 5,
      5: 4,
      6: 3,
      7: 2,
      9999: 0,
      9998: 0,
      9997: 0,
    }
    return Rankings[ranking] ?? 0
  }
  return 0
}

function CalculateChampionsPoints(ranking) {
  if (ranking <= 7) {
    const Rankings = {
      1: 3,
      2: 2,
      3: 1,
    }
    return Rankings[ranking] ?? 0
  }
  return 0
}

module.exports = {
  CalculatePoints,
  CalculateChampionsPoints
}
