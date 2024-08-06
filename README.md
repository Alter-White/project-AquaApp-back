# AquaTrack App

## Introduction

The AquaTrack App ensures the processing and storage of data about users and the water they consume. It provides a back-end API, written in Node.js, to support these functionalities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Contributors](#contributors)
- [Related links](#related-links)

## Installation

To install the AquaTrack App, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/Alter-White/project-AquaApp-back.git
   ```
2. Navigate to the project directory:
   ```sh
   cd project-AquaApp-back
   ```
3. Install the necessary dependencies:
   ```sh
   npm install
   ```

## Usage

To use the API, send REST requests. For example:

- To get a list of users:
  ```http
  GET /users
  ```

## Features

- User registration and authorization.
- Logging water consumption statistics.

## Dependencies

The project uses the following dependencies:

- bcrypt
- cloudinary
- cookie-parser
- cors
- dotenv
- express
- handlebars
- http-errors
- joi
- jsonwebtoken
- mongoose
- multer
- nodemailer
- pino-http
- swagger-ui-express

## Configuration

Configuration settings are stored in the `.env.example` file. Ensure you rename this file to `.env` and update the necessary fields.

## Documentation

For detailed API documentation, visit: [API Docs](https://project-aquaapp-back.onrender.com/api-docs/)

## Contributors

- [Alter White](https://github.com/Alter-White)
- [Dmytro Sulym](https://github.com/oddsGold)
- [Iva02vi](https://github.com/Iva02vi)
- [iziKomSD](https://github.com/iziKomSD)

## Related links

- [Frontend repository](https://github.com/oleksasa/project-AquaApp-front)
- [Live page](https://project-aqua-app-front.vercel.app)
- [API Docs](https://project-aquaapp-back.onrender.com/api-docs/)
- [Backend on Render](https://project-aquaapp-back.onrender.com)
