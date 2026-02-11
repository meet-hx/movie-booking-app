import { Show } from 'src/generated/prisma/client';

export interface CreateShowData {
  movieId: string;
  theaterId: string;
  theaterScreenId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
}

export interface ShowFilters {
  date?: Date;
  theaterId?: string;
  movieId?: string;
}

export interface ShowWithDetails {
  startTime: Date;
  movie: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    type: string;
    genre: {
      id: string;
      name: string;
    } | null;
  };
  theater: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
    website: string | null;
  };
}

export interface SeatAvailabilityData {
  allSeats: {
    id: string;
    rowNumber: string;
    seatNumbers: number[];
    seatCategoryId: string;
    seatCategory: {
      id: string;
      name: string;
      additionalPrice: number;
    };
  }[];
  bookedSeats: {
    seatId: string;
    seatNumber: number;
    userId: string;
    bookingStatus: string;
  }[];
  seatCategories: {
    id: string;
    name: string;
    additionalPrice: number;
  }[];
  basePrice: number;
}

export interface ShowRepository {
  findById(id: string): Promise<Show | null>;
  findByIdWithDetails(id: string): Promise<ShowWithDetails | null>;
  getPricingContext(showId: string, seatIds: string[]): Promise<any | null>;
  create(data: CreateShowData): Promise<Show>;
  findAll(filters: ShowFilters): Promise<Show[]>;
  findAllWithDetails(filters: ShowFilters): Promise<ShowWithDetails[]>;
  findOverlappingShow(
    theaterScreenId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Show | null>;
  getSeatAvailabilityData(showId: string): Promise<SeatAvailabilityData | null>;
}
