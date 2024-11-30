
# Task Management System (Dockerized)

This is a task management system built using **Node.js**, **MongoDB**, and **React**. The application is fully containerized using **Docker** and can be easily deployed with **Docker Compose**.

---

## Features
- **User Authentication**: Register and log in to manage tasks.
- **Task Management**: Create, view, update, and delete tasks.
- **Dockerized Deployment**: Easily deployable using Docker and Docker Compose.
<!-- - **Real-Time Notifications**: Alerts for overdue tasks using `node-cron` and WebSockets. -->

---

## Prerequisites
Ensure the following tools are installed:
- **Docker**
- **Docker Compose**

---

## File Structure
```plaintext
task-management/
├── client/               # React frontend
├── server/               # Node.js backend
├── mongo-data/           # MongoDB data volume (created automatically)
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # Project documentation
```

---

## Setting Up the Application

### 1. Clone the Repository
```bash
git clone https://github.com/bibashjaprel/task-management.git
cd task-management
```

### 2. Environment Variables
Create a `.env` file inside the `server` directory with the following content:
```env
MONGO_URI=mongodb://mongo:27017/taskdb
SECRET=SUperSecrE7PaSSW0rd
PORT=5001
```

---

## Running the Application

### 1. Build and Start Containers
Run the following command to build and start the containers:
```bash
docker-compose up --build
```

### 2. Access the Application
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5001](http://localhost:5001)
- **MongoDB**: Runs locally on port `27017`.

### 3. Stopping the Containers
To stop the containers without removing them:
```bash
docker-compose stop
```

### 4. Removing Containers and Volumes
To remove all containers, networks, and volumes:
```bash
docker-compose down -v
```

---

## Docker Compose Configuration
The `docker-compose.yml` defines the following services:

### Backend Service
- **Build Context**: `server/`
- **Ports**: `5001:5001`
- **Environment Variables**: Reads from `.env` file.
- **Dependencies**: Depends on the MongoDB service.

### Frontend Service
- **Build Context**: `client/`
- **Ports**: `3000:3000`
- **Dependencies**: Depends on the Backend service.

### MongoDB Service
- **Image**: `mongo:latest`
- **Ports**: `27017:27017`
- **Data Volume**: `./mongo-data:/data/db`

---

## Customization

### Adjusting Ports
If the default ports conflict with other applications, update the `ports` section in `docker-compose.yml`:
```yaml
backend:
  ports:
    - "5002:5001"  # Change host port
frontend:
  ports:
    - "4000:3000"  # Change host port
```

### Persistent Data
The MongoDB data is stored in the `mongo-data` directory. Ensure it is backed up to avoid data loss during container removal.

---

## Troubleshooting

### Common Issues
1. **Containers not starting**:
   - Check logs with:
     ```bash
     docker-compose logs
     ```
2. **MongoDB connection error**:
   - Ensure the `MONGO_URI` in the `.env` file matches the MongoDB service name (`mongo`) defined in `docker-compose.yml`.

### Rebuilding Containers
If you make changes to the code, rebuild the containers:
```bash
docker-compose up --build
```

---
