# Jenkins Installation on Linux

## Prerequisites
- Ubuntu/Debian or CentOS/RHEL
- Java JDK 11 or later

---

## Ubuntu / Debian

1. Install Java:
   ```bash
   sudo apt update
   sudo apt install fontconfig openjdk-17-jre -y
   ```

2. Add Jenkins repository:
   ```bash
   curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
     /usr/share/keyrings/jenkins-keyring.asc > /dev/null

   echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
     https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
     /etc/apt/sources.list.d/jenkins.list > /dev/null
   ```

3. Install Jenkins:
   ```bash
   sudo apt update
   sudo apt install jenkins -y
   ```

4. Start Jenkins:
   ```bash
   sudo systemctl enable jenkins
   sudo systemctl start jenkins
   ```

5. Access Jenkins:
   ```
   http://localhost:8080
   ```

---

## CentOS / RHEL

1. Install Java:
   ```bash
   sudo yum install java-17-openjdk -y
   ```

2. Add Jenkins repo:
   ```bash
   sudo wget -O /etc/yum.repos.d/jenkins.repo \
     https://pkg.jenkins.io/redhat-stable/jenkins.repo
   sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
   ```

3. Install Jenkins:
   ```bash
   sudo yum install jenkins -y
   ```

4. Start Jenkins:
   ```bash
   sudo systemctl enable jenkins
   sudo systemctl start jenkins
   ```

5. Open Jenkins in your browser:
   ```
   http://localhost:8080
   ```

---

✅ Jenkins is now installed on Linux.
