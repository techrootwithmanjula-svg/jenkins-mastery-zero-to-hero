# Jenkins Installation with Docker

## Prerequisites
- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Basic Docker knowledge

## Steps

1. Pull the official Jenkins LTS image:
   ```bash
   docker pull jenkins/jenkins:lts
   ```

2. Run Jenkins container:
   ```bash
   docker run -d \
     --name jenkins \
     -p 8080:8080 -p 50000:50000 \
     -v jenkins_home:/var/jenkins_home \
     jenkins/jenkins:lts
   ```

3. Access Jenkins:
   ```
   http://localhost:8080
   ```

4. Retrieve the initial admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```

---

✅ Jenkins is now running in Docker.
