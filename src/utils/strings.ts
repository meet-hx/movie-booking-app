export class Strings {
  static auth = {
    userNotFound: 'User not found',
    invalidPassword: 'Invalid password',
    userAlreadyExists: 'User already exists with this email or contact number',
  };
  static theater = {
    notFound: 'Theater not found.',
  };
  static theaterScreen = {
    notFound: 'Theater screen not found.',
    duplicateScreenNo: (options: { screenNo: number }) =>
      `Duplicate screenNo ${options.screenNo} in request.`,
    screenAlreadyExists: (options: { screenNo: number; theaterId: string }) =>
      `Screen ${options.screenNo} already exists for theater ${options.theaterId}.`,
    mismatch: 'Theater Screen does not belong to the specified Theater.',
  };
  static screenSeat = {
    notFound: 'Screen seat not found.',
    duplicateRowNumber: (options: { rowNumber: string }) =>
      `Row number ${options.rowNumber} already exists in this screen.`,
  };
  static seatCategory = {
    notFound: (options: { id: string }) =>
      `Seat category ${options.id} not found.`,
    mismatch: (options: { categoryId: string; theaterScreenId: string }) =>
      `Seat category ${options.categoryId} does not belong to screen ${options.theaterScreenId}.`,
  };
  static movie = {
    notFound: 'Movie not found.',
  };
  static genre = {
    notFound: 'Genre not found.',
  };
  static show = {
    notFound: 'Show not found.',
    overlap: 'Show time overlaps with an existing show on this screen.',
    invalidTime: 'Start time must be before end time.',
  };
  static booking = {
    seatNotFound: (options: { rowNumber: string; seatNumber: number }) =>
      `Seat ${options.rowNumber}${options.seatNumber} not found for this show.`,
    seatAlreadyBooked: (options: { seats: string[] }) =>
      `Seats already reserved or booked: ${options.seats.join(', ')}.`,
    duplicateSeatSelection: 'Duplicate seats are not allowed in the request.',
    intentNotFound: 'Booking intent not found.',
    intentExpired: 'Booking intent has expired.',
    intentAlreadyProcessed: 'Booking intent has already been processed.',
    webhookSignatureMissing: 'Stripe webhook signature is missing.',
    stripeNotConfigured: 'Stripe is not configured.',
  };
}
