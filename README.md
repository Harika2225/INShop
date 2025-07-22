# INShop - Innerwear Aggregator Application

INShop is a web application that aggregates innerwear products for men and women from multiple e-commerce platforms including Amazon, Flipkart, Myntra, and Ajio.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Python (FastAPI)
- **Database**: PostgreSQL

## Project Structure

```
INShop/
├── frontend/           # React application
├── backend/            # Python backend (FastAPI)
├── database/           # PostgreSQL scripts and migrations
├── docs/               # Documentation
└── README.md           # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+
- PostgreSQL

### Backend Setup
1. Create a virtual environment
2. Install dependencies: `pip install -r backend/requirements.txt`
3. Configure database in `backend/config.py`
4. Run migrations: `cd backend && python migrate.py`
5. Start server: `cd backend && python main.py`

### Frontend Setup
1. Install dependencies: `cd frontend && npm install`
2. Start development server: `cd frontend && npm start`

### Database Setup
1. Create PostgreSQL database: `createdb inshop`
2. Run initialization script: `psql -d inshop -f database/init.sql`

## Features

- Aggregate product data from multiple e-commerce sites
- Filter by gender, brand, type, price range, etc.
- Compare prices across different platforms
- Save favorite products
- Get notifications for price drops
