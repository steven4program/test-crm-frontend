const formatUSPhoneWith10Digits = (digits: string): string => {
  const areaCode = digits.substring(0, 3)
  const exchange = digits.substring(3, 6)
  const number = digits.substring(6, 10)
  return `(${areaCode}) ${exchange}-${number}`
}

const formatUSPhoneWith11Digits = (digits: string): string => {
  const areaCode = digits.substring(1, 4)
  const exchange = digits.substring(4, 7)
  const number = digits.substring(7, 11)
  return `+1 (${areaCode}) ${exchange}-${number}`
}

const isAlreadyFormatted = (phone: string): boolean => {
  return !!(
    phone.match(/^\+1 \(\d{3}\) \d{3}-\d{4}$/) ||
    phone.match(/^\(\d{3}\) \d{3}-\d{4}$/)
  )
}

export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return ''
  
  if (isAlreadyFormatted(phone)) {
    return phone
  }
  
  const hasCountryCode = phone.startsWith('+1')
  const digits = phone.replace(/\D/g, '')
  
  if (digits.length < 10) return phone
  
  // Handle phone numbers with +1 prefix
  if (hasCountryCode) {
    if (digits.length === 11 && digits.startsWith('1')) {
      return formatUSPhoneWith11Digits(digits)
    }
    if (digits.length === 10) {
      return `+1 ${formatUSPhoneWith10Digits(digits)}`
    }
  }
  
  // Handle 11-digit numbers without + prefix (with country code 1)
  if (digits.length === 11 && digits.startsWith('1')) {
    return formatUSPhoneWith11Digits(digits)
  }
  
  // Handle 10-digit numbers (without country code)
  if (digits.length === 10) {
    return formatUSPhoneWith10Digits(digits)
  }
  
  return phone
}