<<<<<<< HEAD
<<<<<<< HEAD
# EduHub - Deployment Guide

## Deploy to Render

### Prerequisites
- A Render account (sign up at https://render.com)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create a new Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" and select "Web Service"
   - Connect your repository
   - Configure the service:
     - **Name**: eduhub (or your preferred name)
     - **Environment**: Docker
     - **Region**: Choose your preferred region
     - **Branch**: main
     - **Plan**: Free (or your preferred plan)

3. **Render will automatically**:
   - Detect the Dockerfile
   - Build your application
   - Deploy it to a public URL

4. **Access your application**:
   - Your app will be available at: `https://your-app-name.onrender.com`

### Local Docker Testing

Before deploying, you can test locally:

```bash
# Build the Docker image
docker build -t eduhub .

# Run the container
docker run -p 8080:8080 eduhub

# Access at http://localhost:8080
```

### Notes
- The application runs on port 8080 inside the container
- Render automatically maps this to HTTPS (port 443)
- Free tier services may sleep after inactivity
=======
# EduHub
A complete solution to manage students, faculty, attendance, courses, and communication — all in one hub.
>>>>>>> 6f5efad49684dedd1f68a533784e0771b1b4fc76
=======
# EduHub
A complete solution to manage students, faculty, attendance, courses, and communication — all in one hub.
>>>>>>> 6f5efad49684dedd1f68a533784e0771b1b4fc76
