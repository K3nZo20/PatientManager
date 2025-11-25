# PatientManager – Medical Appointment Management System
## Overview

PatientManager is a full-stack application for managing patients, employees, visit types, and medical appointments.  
It includes a React frontend and an ASP.NET Core Web API backend using SQL Server.

The system supports:

- Adding and editing patients  
- Managing employees  
- Defining visit types  
- Scheduling and modifying appointments via an interactive calendar  
- Optional generation of development test data  

---

## Screenshots

### Calendar View  
<img width="1896" height="910" alt="PatientManagerDayCallendarScreen" src="https://github.com/user-attachments/assets/101b5a7a-e41b-438a-be93-cd4bc1c3736a" />


### Visit Type Form  
<img width="1905" height="565" alt="PatientManageVisitTypesrScreen" src="https://github.com/user-attachments/assets/378ddba5-1fa9-4f85-befc-1524afbc3f18" />


### Visit List  
<img width="1890" height="952" alt="PatientManagerSchedulePageScreen" src="https://github.com/user-attachments/assets/e4ebff63-9e5d-4f4c-ad72-2e92de02afaf" />


### Patient List 
<img width="1907" height="860" alt="PatientManagerPatientListScreen" src="https://github.com/user-attachments/assets/0255ca21-21a8-498d-8883-b79a012c3316" />

---

## Technologies Used

### Backend
- .NET 8  
- ASP.NET Core Web API  
- Entity Framework Core  
- SQL Server  
- Swagger  

### Frontend
- React 18  
- React Big Calendar  
- Fetch API  
- CSS / Flexbox

## Database Structure

The application uses a relational SQL Server database with the following tables:

<img width="1342" height="501" alt="PatientManagerScreenDatabase" src="https://github.com/user-attachments/assets/86ff4ac7-9d7a-4a71-9e3e-7f6d63c4fd5a" />

---

# Running the Application

## Recommended: Use the included startup script

Run:
PatientManager.bat


This script automatically launches:

- the backend (`dotnet run`)
- the frontend (`npm start`)

### Optional: Create a desktop shortcut

1. Right-click `PatientManager.bat`  
2. Select **Send to → Desktop (create shortcut)**  
3. Optionally change the icon in the shortcut’s properties  

Running the shortcut starts the entire system.

---

# Manual Setup

## 1. Start the backend

```bash
cd PatientManager.Api
dotnet run
```

The API runs on:

- http://localhost:5120
- https://localhost:7193

##2. Start the frontend

cd PatientManager.Api/FrontEnd
npm install
npm start

Frontend runs on:

- http://localhost:3000


## Database Configuration

Edit appsettings.json:

`"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=PatientManager;Trusted_Connection=True;"
}`

The database will be created automatically if missing.

## Optional: Generating Test Data

Inside Program.cs you can enable sample data:

`//DataGenerator.GenerateEmployee(dbContext, 10);
//DataGenerator.GeneratePatients(dbContext, 100);
`
## Futures

-User authentication and roles

-Expanded calendar views (weekly, agenda)

-PDF export of day visits

-Azure deployment
