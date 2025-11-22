export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export const formatHours = (hours?: number) => {
  if (!hours) return 'Flexible schedule'
  return `${hours} hrs`
}
