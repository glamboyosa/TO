function freeCreditsExpiry() {
  // Get the current date
  const currentDate = new Date()

  // Create a new date by adding 7 days to the current date
  const futureDate = new Date()
  futureDate.setDate(currentDate.getDate() + 7)
  return futureDate
}
export { freeCreditsExpiry }
