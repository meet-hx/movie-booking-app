export interface SeatRowDto {
  rowNumber: string;
  seatNumbers: number[];
}

export interface SeatCategoryDto {
  name: string;
  description?: string;
  additionalPrice: number;
  seats: SeatRowDto[];
}

export interface TheaterScreenDto {
  screenNo: number;
  totalSeats: number;
  isAvailable?: boolean;
  seatCategories: SeatCategoryDto[];
}

export interface CreateTheaterRequestDto {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  screens: TheaterScreenDto[];
}

export interface UpdateTheaterRequestDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string | null;
}
