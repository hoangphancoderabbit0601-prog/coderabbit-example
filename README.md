# intern-nodejs-source

## Overview
This project is a full-stack application built with Node.js. It includes an API backend using Express and Sequelize, as well as a frontend built with Vue.js and PrimeVue. The project also incorporates Yup for validation on both the backend and frontend.

## Technology Stack

### Backend
- **Express**: Web framework for building the RESTful API.
- **Sequelize**: ORM for database interaction with support for multiple databases.
- **Yup**: Validation schema used for validating data in the API.

### Frontend
- **Vue.js**: Progressive JavaScript framework for building the user interface.
- **PrimeVue**: UI component library for Vue.js.
- **Yup**: Validation schema used for form validation in the frontend.

## Project Structure

```plaintext
├── /apps
│   └── /api             # Api application
│   └── /front           # Web application
├── /packages
│   └── /factory         # Type definition
│   └── /domain          # Model logic
│   └── /migration       # Migrate DB
├── .gitignore
├── package.json
└── README.md
```

### Installation

1. Setup

Clone this repository:
```
git clone <repository-url>
cd intern-nodejs-source
```

2. Install dependencies for both frontend and backend:
```
yarn
```

3. Set up the database:
To configure the database connection, create or update the `.env` file in the `/packages/migration` directory with the following variables:

| Variable        | Description                                     | Example                  |
|-----------------|-------------------------------------------------|--------------------------|
| `DB_USER`       | The username for your database connection       | `your_database_user`      |
| `DB_PASS`       | The password for your database user             | `your_database_password`  |
| `DB_HOST`       | The host where your database is running         | `localhost`               |
| `DB_PORT`       | The port where your database is running         | `3306`                    |
| `DB_NAME`       | The name of your database                       | `your_database_name`      |

Example `.env` file:
```env
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
```

4. Run the database migrations:

To apply the database migrations, run the following command:
```
yarn migrate:up
```

If you need to undo the migrations, you can run:
```
yarn migrate:down
```