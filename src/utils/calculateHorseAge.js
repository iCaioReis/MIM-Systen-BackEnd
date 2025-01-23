function calculateHorseAge(date) {
    const today = new Date()
    const born = new Date(date)
  
    let years = today.getFullYear() - born.getFullYear()
    let months = today.getMonth() - born.getMonth()
    let days = today.getDate() - born.getDate()
  
    if (months < 0) {
      years--
      months += 12
    }
  
    if (days < 0) {
      months--
      const lastDayOfPreviousMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
      ).getDate()
      days += lastDayOfPreviousMonth
    }
  
    const totalMonths = years * 12 + months
  
    return (totalMonths)
  }
  
  module.exports = calculateHorseAge;