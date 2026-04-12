from weasyprint import HTML

# Content for the comprehensive README
readme_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 15mm 12mm;
            background-color: #fcfcfc;
        }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.5;
            color: #2c3e50;
            margin: 0;
            font-size: 10pt;
        }
        .header-banner {
            background-color: #2c3e50;
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }
        h1 { margin: 0; font-size: 22pt; letter-spacing: 1px; }
        h2 { 
            color: #2c3e50; 
            border-left: 5px solid #3498db; 
            padding-left: 10px; 
            margin-top: 25px; 
            font-size: 15pt;
        }
        h3 { color: #2980b9; margin-top: 20px; font-size: 12pt; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        code {
            background-color: #f0f3f5;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Consolas', monospace;
            font-size: 9pt;
        }
        pre {
            background-color: #2d3436;
            color: #dfe6e9;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 9pt;
            line-height: 1.4;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #e0e0e0;
        }
        th { background-color: #f8f9fa; font-weight: bold; }
        .endpoint-tag {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 9pt;
            margin-right: 10px;
        }
        .post { background-color: #e67e22; color: white; }
        .success { color: #27ae60; font-weight: bold; }
        .error { color: #e74c3c; font-weight: bold; }
        .callout {
            background-color: #e8f4fd;
            border-left: 4px solid #3498db;
            padding: 12px;
            margin: 15px 0;
            border-radius: 0 4px 4px 0;
        }
    </style>
</head>
<body>
    <div class="header-banner">
        <h1>ResuMetric AI</h1>
        <p>Backend API Documentation & Integration Guide</p>
    </div>

    <h2>Project Overview</h2>
    <p>ResuMetric AI is a specialized platform designed for AI-driven resume analysis and interview preparation. This documentation focuses on the <strong>User Authentication Module</strong>, which manages registration, login, and secure session handling using JSON Web Tokens (JWT).</p>

    <h2>1. Local Setup & Environment</h2>
    <p>To run the backend locally, ensure you have the following configurations in your <code>.env</code> file:</p>
    <pre>
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
    </pre>
    <div class="callout">
        <strong>Note:</strong> On Render, do not set the <code>PORT</code> variable; the platform assigns it dynamically. Ensure <code>MONGODB_URI</code> and <code>JWT_SECRET</code> are added to the Render "Environment" dashboard.
    </div>

    <h2>2. API Endpoints</h2>

    <h3>A. User Registration</h3>
    <p><span class="endpoint-tag post">POST</span> <code>/users/register</code></p>
    <p>Registers a new user. The password is automatically hashed before storage.</p>

    <h4>Request Body (JSON)</h4>
    <pre>{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane.smith@example.com",
  "password": "strongPassword123"
}</pre>

    <h4>Validation Requirements</h4>
    <table>
        <tr><th>Field</th><th>Constraint</th></tr>
        <tr><td>fullname.firstname</td><td>Required, Minimum 3 characters</td></tr>
        <tr><td>email</td><td>Required, Must be a valid email format</td></tr>
        <tr><td>password</td><td>Required, Minimum 6 characters</td></tr>
    </table>

    <h3>B. User Login</h3>
    <p><span class="endpoint-tag post">POST</span> <code>/users/login</code></p>
    <p>Authenticates a user by verifying the email and password.</p>

    <h4>Request Body (JSON)</h4>
    <pre>{
  "email": "jane.smith@example.com",
  "password": "strongPassword123"
}</pre>

    <h2>3. Response Schemas</h2>

    <h3>Success (201 Created)</h3>
    <p>Both endpoints return the same success structure:</p>
    <pre>{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Smith"
    },
    "email": "jane.smith@example.com",
    "_id": "65f123abc456def7890",
    "socketId": null
  }
}</pre>

    <h3>Error Handling</h3>
    <ul>
        <li><span class="error">400 Bad Request:</span> Occurs if input fails validation or if a user already exists.</li>
        <li><span class="error">401 Unauthorized:</span> Occurs during login if credentials do not match.</li>
    </ul>

    <h2>4. Frontend Integration Guide</h2>
    <h3>Authentication Flow</h3>
    <ol>
        <li>Send credentials to <code>/login</code> or <code>/register</code>.</li>
        <li>On success, store the <code>token</code> in <code>localStorage</code>.</li>
        <li>Include the token in the <code>Authorization</code> header for protected requests:</li>
    </ol>
    <pre>Authorization: Bearer &lt;token&gt;</pre>

    <h3>Data Privacy</h3>
    <p>The <code>password</code> field is marked with <code>select: false</code> in the database schema. It is never returned in API responses to ensure user security.</p>

    <div class="callout">
        <strong>Deployment:</strong> The live API is hosted at <code>https://vista-resuai-3.onrender.com/</code>.
    </div>

</body>
</html>
"""

# Generate the PDF
output_pdf = 'ResuMetric_AI_API_README.pdf'
HTML(string=readme_html).write_pdf(output_pdf)