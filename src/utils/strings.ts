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
}
