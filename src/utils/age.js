export function age (dateStr) {
  if (dateStr) {
    const year = parseInt(dateStr.substr(0, 4))
    const month = parseInt(dateStr.substr(5, 7))
    const day = parseInt(dateStr.substr(8, 10))
    const now = new Date()
    const nowYear = now.getFullYear()
    const nowMonth = now.getMonth() + 1
    const nowDay = now.getDate()
    let age = nowYear - year
    if (nowMonth < month) {
        age -= 1
        return age
    }
    if (nowMonth > month) {
        return age
    }
    // nowMonth == month
    if (nowDay < day) {
        age -= 1
        return age
    }
    if (nowDay > day) {
        return age
    }
    // nowDay == day
    return age
  }
  return null
}
