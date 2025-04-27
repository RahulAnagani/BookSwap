# BookSwap Backend

This is the backend for the BookSwap application, built using **Node.js**, **Express.js**, and **MongoDB**. The backend handles user authentication, book request management, chat functionality, and serves data to the frontend.

## Features

- **User Authentication**: JWT-based authentication for secure login and registration.
- **Book Requests**: Create, accept, decline, and cancel buy/swap requests.
- **Chat**: Real-time messaging between users.
- **Ratings & Reviews**: Users can leave ratings and reviews for books.
- **Genres & Filters**: Users can filter books by genres or location.

## Tech Stack

- **Node.js**: JavaScript runtime.
- **Express.js**: Backend framework for handling HTTP requests.
- **MongoDB**: NoSQL database to store user, book, and request data.
- **Mongoose**: ODM for MongoDB to interact with the database.
- **JWT (JSON Web Token)**: For user authentication.
- **Socket.IO**: Real-time communication for chat functionality.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) - Version 14.x or above
- [MongoDB](https://www.mongodb.com/) - Running locally or using MongoDB Atlas

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/RahulAnagani/BookSwap.git
   cd bookswap/BCK
