# INShop Setup Guide

This guide will help you set up and run the INShop application locally for development and testing.

## Prerequisites

- Python 3.9+ 
- Node.js 16+
- PostgreSQL 13+
- Git

## Database Setup

1. Start your PostgreSQL service:
   ```
   sudo service postgresql start
   ```

2. Create a database user (if needed):
   ```
   sudo -u postgres createuser -P inshop_user
   ```
   (Enter a password when prompted)

3. Create the database and initialize with sample data:
   ```
   sudo -u postgres createdb inshop -O inshop_user
   sudo -u postgres psql -d inshop -f database/init.sql
   ```

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following content:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=inshop
   DB_USER=inshop_user
   DB_PASSWORD=your_password_here
   ```

5. Run the backend server:
   ```
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. The API documentation will be available at:
   - http://localhost:8000/docs (Swagger UI)
   - http://localhost:8000/redoc (ReDoc)

## Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The frontend will be available at http://localhost:3000

## Testing End-to-End Flow

1. With both backend and frontend servers running, open your browser to http://localhost:3000

2. Test the following features:
   - Browse the homepage and navigate to the products page
   - View product listings with filters
   - Click on a product to view its details
   - Add products to favorites
   - Compare multiple products
   - Search for products

3. Check the API interaction in the browser's Developer Tools:
   - Network tab will show API calls to the backend
   - Console will show any errors or warnings

## Troubleshooting

### Database Connection Issues
- Check if PostgreSQL service is running: `sudo service postgresql status`
- Verify database credentials in the .env file
- Make sure the database was created with the correct owner

### Backend Issues
- Check the console output where the backend is running for errors
- Verify all dependencies are installed: `pip list`
- Make sure the database models match the actual database schema

### Frontend Issues
- Check the browser console for errors
- Verify API endpoints in service files match the backend URLs
- Make sure all React dependencies are installed correctly

## Additional Notes

- For development, both frontend and backend have hot-reloading enabled
- The backend uses SQLAlchemy ORM for database operations
- The frontend uses Material UI for styling
- Sample data is loaded from the init.sql file
