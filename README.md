
# NestJS Employee Management System

## Overview
This is a comprehensive NestJS application designed to manage employee work, trades, and salary information using both REST and GraphQL APIs. The project uses MongoDB as its database and follows a modular architecture for scalability and maintainability.

## Core Modules

### 1. Auth Module
Handles user authentication and authorization.
#### Features:
- JWT-based authentication
- Login/Logout functionality
- User registration
- Role-based access control (Owner/Employee roles)

### 2. Database Module
Central database configuration using MongoDB.
#### Manages schemas for:
- Employee
- Salary
- DailyWork
- Trade

### 3. Trade Module
Handles import/export trade operations.
#### Features:
- Trade creation and management
- Status tracking (PENDING/COMPLETED/CANCELLED)
- GraphQL endpoints for trade operations

### 4. Salary Module
Manages employee salary calculations and records.
#### Features:
- Monthly salary tracking
- Automatic salary updates based on daily work
- Salary history queries

### 5. DailyWork Module
Tracks employee daily work records.
#### Features:
- Daily work entry creation
- Work quantity and rate tracking
- Automatic salary calculations

## Technical Features

### API Support:
- REST API with controllers
- GraphQL API with resolvers
- Rate limiting implementation

### Security:
- JWT authentication
- Rate limiting guards (RestThrottlerGuard and GraphqlThrottlerGuard)
- Exception handling (AllExceptionsFilter)

### Logging:
- Custom logger service (MyLoggerService)
- File-based logging
- Error tracking

### Configuration:
- Environment-based configuration using `.env`
- TypeScript configuration
- ESLint and Prettier setup for code quality

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/VISHWAr23/REST-API.git
   ```

2. Navigate to the project directory:
   ```sh
   cd REST-API
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and configure:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=your_preferred_port
   ```

5. Start the server:
   ```sh
   npm run start
   ```

6. The API will be available at:
   ```sh
   http://localhost:PORT
   ```

## API Endpoints

### User Routes
- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Authenticate a user
- **GET** `/users/:id` - Retrieve user details
- **PUT** `/users/:id` - Update user details
- **DELETE** `/users/:id` - Delete a user

### Trade Routes
- **POST** `/trade/create` - Create a new trade
- **GET** `/trade/status/:id` - Get trade status
- **PUT** `/trade/update/:id` - Update trade details

### Salary Routes
- **GET** `/salary/:employeeId` - Get salary details
- **POST** `/salary/update` - Update salary details

### Daily Work Routes
- **POST** `/dailywork/add` - Add daily work entry
- **GET** `/dailywork/:employeeId` - Get daily work records

## Project Structure
```
REST-API/
│── src/
│   ├── auth/
│   ├── database/
│   ├── trade/
│   ├── salary/
│   ├── dailywork/
│   ├── common/
│── config/
│── logs/
│── .env
│── package.json
│── tsconfig.json
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For any queries, feel free to reach out:
- GitHub: [VISHWAr23](https://github.com/VISHWAr23)
- Email: your-email@example.com

