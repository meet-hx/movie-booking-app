table movies
id primary key
title
description
duration
genre
languages
type (2d, 3d, 4d, etc.) enum

table genres
id primary key
name

table languages
id primary key
name

table users
id primary key
name
email
contactNo
password

table theaters
id primary key
name
address
city
state
zipCode
country
phone
email
website

table shows
id primary key
movieId
theaterId
theaterScreenId
startTime
endTime
basePrice

table theaterScreens
id primary key
theaterId
screenNo
totalSeats
isAvailable

table seatCategories
id primary key
name Platinum, Gold, Silver
description
additionalPrice - min 0
theaterScreenId

table screenSeats
id primary key
theaterScreenId
seatCategoryId
rowNumber - A, B, C, etc.
seatNumbers - [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20]

table bookings
id primary key
userId
showId
bookingTime
totalAmount
serviceCharge
paymentStatus

table bookingSeats
id primary key
bookingId
seatId
amount
bookingStatus
