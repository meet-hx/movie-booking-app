1. create the crud for the theaters
2. add the api for the theater screen
   2.1 which takes the below payload in request and do contruct ad theathers

theater screen
{
name String
address String
city String
state String
zipCode String
country String
phone String
email String
website String?
screeens: [{
screenNo: 1,
totalSeats: 100,
isAvailable: true,
seatCategories: [{
name: "Gold",
description: "Gold seats",
additionalPrice: 100,
seats: [{
rowNumber: "A",
seatNumbers: [1, 2, 3, 4, 5]
}]
}]
}]
}

2.2 extensible functionality I can add the screens later on via its api and it takes the screens
{
theaterId: "1",
screens: [{
screenNo: 1,
totalSeats: 100,
isAvailable: true,
seatCategories: [{
name: "Gold",
description: "Gold seats",
additionalPrice: 100,
seats: [{
rowNumber: "A",
seatNumbers: [1, 2, 3, 4, 5],
rowNumber: "B",
seatNumbers: [1, 2, 3, 4, 5],
rowNumber: "C",
seatNumbers: [1, 2, 3, 4, 5]
}]
},{
name: "Silver",
description: "Silver seats",
additionalPrice: 0,
seats: [{
rowNumber: "D",
seatNumbers: [1, 2, 3, 4, 5],
rowNumber: "E",
seatNumbers: [1, 2, 3, 4, 5],
rowNumber: "F",
seatNumbers: [1, 2, 3, 4, 5]
}]
}]
}]
}
based on the above response it only do the operation of add it does throw an error if i want to add the same screenNo: 1 again and if it present

make the service based devided for tht seats in seats service, scrren on the screens service and theater on it on the theater so that it i can use any where, also dto for them mage seperately
like in extends way i can use the seats api which gonna do add seats based on below payload
2.5 = {
"theaterScreenId": "1",
"seatCategories": [
{
"categoryId": "1",
"seats": [
{
"rowNumber": "A",
"seatNumbers": [1, 2, 3, 4, 5]
},
{
"rowNumber": "B",
"seatNumbers": [1, 2, 3, 4, 5]
},
{
"rowNumber": "C",
"seatNumbers": [1, 2, 3, 4, 5]
}
]
},
{
"categoryId": "2",
"seats": [
{
"rowNumber": "D",
"seatNumbers": [1, 2, 3, 4, 5]
},
{
"rowNumber": "E",
"seatNumbers": [1, 2, 3, 4, 5]
},
{
"rowNumber": "F",
"seatNumbers": [1, 2, 3, 4, 5]
}
]
}
]
}

as mention below agin im talling you that you first have to constuct the seats service which do add the seats based on this dto 2.5 and then you have to constuct the screen service which do add the screen based on this dto 2.2 and then you have to constuct the theater service which do add the theater based on this dto 2.1
then you have to add like waterwall model like first create a theater and then do add call the screen service to add the screen and then do add call the seats service to add the seats which is the best way and this functionality should be scallable so that's why i'm telling you this
