export interface BookSeatsCommand {
  userId: string;
  showId: string;
  seatIds: string[];
  serviceCharge: number;
}
