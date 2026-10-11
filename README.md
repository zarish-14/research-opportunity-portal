
# University Research Opportunity Portal  
**Program:** BS Computer Science (5C)  
**Course:** Computer Networks (CN)  
**Semester:** Fall 2026  
**Assignment:** Assignment #01

## 1. Project Overview

The University Research Opportunity Portal is a web-based application designed to manage university research opportunities in one place.Faculty members can create, view, update, close, and delete research opportunities. Students can view available opportunities and their details.
The application consists of a Flask REST API, a MySQL database, and a simple frontend developed using HTML, CSS, and JavaScript.

## 2. Technologies Used

- Python
- Flask
- MySQL
- HTML
- CSS
- JavaScript
- Postman
- Git and GitHub

## 3. Features

- Display all research opportunities.
- View details of a specific opportunity.
- Create a new research opportunity.
- Update existing opportunities.
- Change opportunity status from Open to Closed.
- Delete research opportunities.
- Validate required form fields.
- Display success and error messages.
- Store and retrieve data through the MySQL database.
- Test REST API endpoints using Postman.

## 4. Project Structure

research_portal/
|
|-- app.py
|-- schema.sql
|-- requirements.txt
|-- .env.example
|-- .gitignore
|-- README.md
|-- University Research Opportunity Portal API.postman_collection.json
|
|-- frontend/
    |-- index.html
    |-- style.css
    |-- script.js

## 5. Requirements

Before running the application, install:

- Python 3
- MySQL Server
- A web browser
- Postman (for API testing)

## 6. Installation and Setup

### Step 1: Open the Project Folder

Extract the project ZIP file or clone the GitHub repository.
To clone the repository, run:
git clone YOUR_GITHUB_REPOSITORY_URL
Then open the project directory:
cd research_portal
Replace YOUR_GITHUB_REPOSITORY_URL with the actual GitHub repository URL.

### Step 2: Create a Virtual Environment

On Windows, run:

python -m venv .venv

Activate it using PowerShell:

.\.venv\Scripts\Activate.ps1

### Step 3: Install Dependencies

Run the following command:

pip install -r requirements.txt

### Step 4: Set Up the Database

Start the MySQL server.

Use the provided schema.sql file to create the database and the required table.

Run the SQL statements in MySQL Workbench or the MySQL command line.

Make sure the database and table names match those expected by app.py.

### Step 5: Configure Environment Variables

The real .env file is not included because it may contain private database credentials.

Create a copy of .env.example and name it .env.

Enter your own MySQL connection details in the .env file.

Example configuration (use the exact variable names expected by app.py):

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=research_portal


### Step 6: Run the Backend

Open a terminal in the project root and run:

python app.py

The Flask API should be available at:

http://127.0.0.1:5000

### Step 7: Run the Frontend

Open frontend/index.html in your web browser.

The frontend communicates with the backend API at:

http://127.0.0.1:5000/api/opportunities

Ensure that the Flask server and MySQL database are running before using the application.

## 7. REST API Endpoints

Base URL:

http://127.0.0.1:5000/api/opportunities

GET /api/opportunities

Retrieves all research opportunities.

GET /api/opportunities/<id>

Retrieves a specific research opportunity using its ID.

POST /api/opportunities

Creates a new research opportunity.

PUT /api/opportunities/<id>

Updates an existing research opportunity.

DELETE /api/opportunities/<id>

Deletes a research opportunity.

Each research opportunity includes information such as:

- Unique ID
- Research title
- Research description
- Research area
- Faculty member's name
- Department
- Required skills
- Number of available positions
- Application deadline
- Status (Open or Closed)

## 8. HTTP Status Codes

The API should use appropriate HTTP status codes, including:

- 200 OK: Request completed successfully.
- 201 Created: A new opportunity was created.
- 400 Bad Request: Invalid or missing input data.
- 404 Not Found: The requested opportunity does not exist.
- 500 Internal Server Error: An unexpected server error occurred.

## 9. Postman API Testing

Import the exported Postman collection:

University Research Opportunity Portal API.postman_collection.json

Start the Flask backend before sending requests.

The required testing includes:

1. Create at least three research opportunities.
2. Retrieve all research opportunities.
3. Retrieve one opportunity using its ID.
4. Update an existing opportunity.
5. Change an opportunity's status from Open to Closed.
6. Delete an opportunity.
7. Request the deleted opportunity again and verify a 404 Not Found response.
8. Send invalid or missing data and verify the validation response.

## 10. GitHub Repository

GitHub Repository URL:

https://github.com/zarish-14/research-opportunity-portal


## 11. Security

- Do not upload the real .env file to GitHub.
- Do not include database passwords or private credentials in the submission ZIP.
- Include .env.example with placeholder values.
- Ensure .env is listed in .gitignore.
- If credentials were previously exposed, change them.


