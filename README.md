# Campus Complaint Management

This is a simple local web app for managing campus complaints.
It works on your own computer and does not need any online server.

## What the app does

- Students can create an account, log in, and submit complaints.
- Students can see only the complaints they submitted.
- Admin users can see all complaints from all students.
- Admin users can change a complaint status to "Under Investigation".

## What you need before starting

You do not need to know JavaScript to run this project locally.

Install these first:

1. Node.js
   - Download and install from https://nodejs.org
   - After installing, open a terminal and check it by running:

```bash
node -v
npm -v
```

2. MongoDB Community Server
   - Install MongoDB locally on your computer.
   - Make sure the MongoDB service is running.
   - The app uses this local database address:

```text
mongodb://127.0.0.1:27017/campus_complaint_management
```

If you already have MongoDB installed, you can keep using it.

## Step-by-step setup

### 1) Open the project folder

Open this folder in VS Code or File Explorer:

```text
d:\Code\campus-complaint-management
```

### 2) Create the `.env` file

This project already includes a file named `.env.example`.

Create a new file named `.env` in the project root and copy these values into it:

```env
PORT=3000
SESSION_SECRET=replace-with-a-strong-secret
MONGODB_URI=mongodb://127.0.0.1:27017/campus_complaint_management
```

You can change `SESSION_SECRET` to any text you want.

### 3) Install the project packages

In the project folder, run:

```bash
npm install
```

If PowerShell blocks the command, use this instead on Windows:

```bash
npm.cmd install
```

### 4) Start MongoDB locally

Make sure MongoDB is running before starting the app.

If you installed MongoDB as a service, start it from Services on Windows.
If you use MongoDB Compass or MongoDB Shell, make sure the local server is active.

### 5) Start the app

Run:

```bash
npm start
```

For development mode with auto-restart:

```bash
npm run dev
```

If PowerShell blocks it on Windows, use:

```bash
npm.cmd start
```

or:

```bash
npm.cmd run dev
```

### 6) Open the app in your browser

Go to:

```text
http://localhost:3000
```

## How to use the app

1. Open the login page.
2. Click Register if you do not have an account.
3. Create either a student or admin account.
4. Log in with your username and password.
5. Students can add complaints.
6. Admins can review all complaints and update the status.

## Project files in simple words

- `src/server.js` - starts the app.
- `src/routes/` - handles login, register, dashboard, and complaint actions.
- `src/models/` - stores data rules for users and complaints.
- `src/views/` - contains the web page templates.
- `src/public/css/styles.css` - controls the look and design.

## Common issues

### The app does not open

- Check that MongoDB is running.
- Check that the terminal shows the server started successfully.
- Make sure the URL is exactly `http://localhost:3000`.

### I get an npm error in PowerShell

Use `npm.cmd install` or `npm.cmd start` instead of `npm install` / `npm start`.

### MongoDB connection failed

- Make sure MongoDB is installed locally.
- Make sure the database address in `.env` is correct.
- Default local address:

```text
mongodb://127.0.0.1:27017/campus_complaint_management
```

## Notes

- This app is meant to run on your local computer.
- You can safely restart the app anytime after MongoDB and Node.js are installed.
