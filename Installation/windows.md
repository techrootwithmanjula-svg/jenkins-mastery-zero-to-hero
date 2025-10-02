# Jenkins Installation on Windows

## Prerequisites
- Windows 10/11 (or Windows Server)
- Java JDK 11 or later installed
- Administrator access

## Steps

1. Download the Jenkins Windows installer:
   - [Jenkins MSI Installer](https://www.jenkins.io/download/)

2. Run the installer:
   - Accept default settings (Jenkins runs as a Windows service by default).
   - Select Java installation if prompted.

3. Once installed, Jenkins will start automatically.

4. Open Jenkins in your browser:
   ```
   http://localhost:8080
   ```

5. Get the initial admin password:
   - Navigate to:
     ```
     C:\Program Files\Jenkins\secrets\initialAdminPassword
     ```
   - Copy the password and paste it into the setup wizard.

---

✅ Jenkins is now running as a Windows service.
