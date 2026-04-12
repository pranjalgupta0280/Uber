import os

# Content for the README.md file
readme_content = """# ResuMetric AI - API Documentation

This documentation provides details for the User Authentication API. It is designed to help frontend developers integrate the registration and login flows seamlessly.

## Base URL
`http://localhost:3000/users` *(Adjust based on your server configuration)*

---

## Authentication Endpoints

### 1. Register User
Creates a new user account in the system and returns an authentication token.

* **URL**: `/register`
* **Method**: `POST`
* **Auth Required**: No
* **Headers**: `Content-Type: application/json`

#### Request Body (JSON)
The API expects a nested `fullname` object. Both `email` and `password` are required.

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}