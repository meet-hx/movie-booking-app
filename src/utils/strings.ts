export class Strings {
  static auth = {
    userNotFound: 'User not found',
    invalidPassword: 'Invalid password',
    userAlreadyExists: 'User already exists',
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
  static show = {
    notFound: 'Show not found.',
    overlap: 'Show time overlaps with an existing show on this screen.',
    invalidTime: 'Start time must be before end time.',
  };
}
