const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
// const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

const getJsonData = (fileName) => {
  const filePath = path.join(__dirname, "data", fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.post("/api/auth/authenticate", (req, res) => {
  if (req.body.userName == "user" && req.body.password == "user") {
    res.json({
      authentication:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMiIsImdpdmVuX25hbWUiOiJNYXplbiIsImZhbWlseV9uYW1lIjoiU2FtaSIsInVzZXJUeXBlIjoiVXNlciIsIm5iZiI6MTczMjExNTQyMCwiZXhwIjoxNzMyMTE5MDIwLCJpc3MiOiJodHRwczovL2FwcC1ob3RlbC1yZXNlcnZhdGlvbi13ZWJhcGktdWFlLWRldi0wMDEuYXp1cmV3ZWJzaXRlcy5uZXQifQ.SosxseAWXFuoNqSkeeurjet6FiqEX-4Mheo4o1DbCYc",
      userType: "User",
    });
  } else if (req.body.userName == "admin" && req.body.password == "admin") {
    res.json({
      authentication:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSIsImdpdmVuX25hbWUiOiJNb2hhbWFkIiwiZmFtaWx5X25hbWUiOiJNaWxoZW0iLCJ1c2VyVHlwZSI6IkFkbWluIiwibmJmIjoxNzMyNjQ4ODU5LCJleHAiOjE3MzI2NTI0NTksImlzcyI6Imh0dHBzOi8vYXBwLWhvdGVsLXJlc2VydmF0aW9uLXdlYmFwaS11YWUtZGV2LTAwMS5henVyZXdlYnNpdGVzLm5ldCJ9.IJ-ekmzr0FF1oNSrjDwElMZhoyc42H7nFq-3bWKuG8Q",
      userType: "Admin",
    });
  } else {
    res.status(401).json({ message: "Invalid user or password" });
  }
});

app.get("/api/home/users/2/recent-hotels", (req, res) => {
  res.json(getJsonData("recentHotels.json"));
});

app.get("/api/home/featured-deals", (req, res) => {
  res.json(getJsonData("featuredDeals.json"));
});

app.get("/api/home/destinations/trending", (req, res) => {
  res.json(getJsonData("trending.json"));
});

app.get("/api/hotels", (req, res) => {
  const hotels = getJsonData("hotels.json");
  const { searchQuery = "", pageNumber = 1, pageSize = 5 } = req.query;
  let filteredHotels = hotels;
  if (searchQuery) {
    filteredHotels = filteredHotels.filter(
      (hotel) =>
        (hotel.hotelName &&
          hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (hotel.name &&
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        hotel.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + parseInt(pageSize);
  filteredHotels = filteredHotels.map((hotel) => {
    return {
      ...hotel,
      name: hotel.hotelName || hotel.name,
    };
  });
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);
  res.json(paginatedHotels);
});

app.get("/api/hotels/:id/gallery", (req, res) => {
  res.json(getJsonData("gallery.json"));
});

app.get("/api/hotels/:id", (req, res) => {
  res.json(getJsonData("hotelId.json"));
});

app.get("/api/hotels/:id/available-rooms", (req, res) => {
  res.json(getJsonData("availableRooms.json"));
});

app.get("/api/hotels/:id/reviews", (req, res) => {
  res.json(getJsonData("reviews.json"));
});

app.post("/api/bookings", (req, res) => {
  res.json(getJsonData("reviews.json"));
});

app.get("/api/bookings/:id", (req, res) => {
  res.json(getJsonData("bookings.json"));
});

app.get("/api/home/search", async (req, res) => {
  const { city, checkInDate, checkOutDate, adults, children, numberOfRooms } =
    req.query;
  const rooms = getJsonData("searchResults.json");
  let filteredResults = rooms;
  if (city) {
    filteredResults = filteredResults.filter((room) =>
      room.cityName.toLowerCase().includes(city.toLowerCase())
    );
  }

  if (adults) {
    filteredResults = filteredResults.filter((room) => {
      return room.numberOfAdults >= adults;
    });
  }

  if (children) {
    filteredResults = filteredResults.filter(
      (room) => room.numberOfChildren >= children
    );
  }

  if (numberOfRooms) {
    filteredResults = filteredResults.filter(
      (room) => room.numberOfRooms >= numberOfRooms
    );
  }

  res.json(filteredResults);
});

app.get("/api/search-results/amenities", (req, res) => {
  res.json(getJsonData("amenities.json"));
});

app.get("/api/cities", (req, res) => {
  res.json(getJsonData("cities.json"));
});

app.get("/api/hotels/:id/rooms", (req, res) => {
  res.json(getJsonData("rooms.json"));
});

app.put("/api/cities/:id", (req, res) => {
  res.json(getJsonData("cities.json"));
});
app.delete("/api/cities/:id", (req, res) => {
  res.json(getJsonData("cities.json"));
});
app.post("/api/cities", (req, res) => {
  res.json(getJsonData("cities.json"));
});

app.put("/api/hotels/:id", (req, res) => {
  res.json(getJsonData("hotels.json"));
});
app.delete("/api/hotels/:id", (req, res) => {
  res.json(getJsonData("hotels.json"));
});
app.post("/api/hotels", (req, res) => {
  res.json(getJsonData("hotels.json"));
});

app.put("/api/rooms/:id", (req, res) => {
  res.json(getJsonData("rooms.json"));
});
app.delete("/api/rooms/:id", (req, res) => {
  res.json(getJsonData("rooms.json"));
});
app.post("/api/rooms", (req, res) => {
  res.json(getJsonData("rooms.json"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
