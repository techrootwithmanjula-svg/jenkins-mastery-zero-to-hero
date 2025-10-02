# Jenkins Installation on macOS

## Prerequisites
- macOS with admin access
- [Homebrew](https://brew.sh/) installed
- Java (JDK 11 or later)

## Steps

1. Install Java (if not already installed):
   ```bash
   brew install openjdk@17
   ```

2. Install Jenkins:
   ```bash
   brew install jenkins-lts
   ```

3. Start Jenkins:
   ```bash
   brew services start jenkins-lts
   ```

4. Access Jenkins in your browser:
   ```
   http://localhost:8080
   ```

5. Retrieve the initial admin password:
   ```bash
   cat /Users/$(whoami)/.jenkins/secrets/initialAdminPassword
   ```

---

✅ You’re now ready to set up Jenkins on macOS!
