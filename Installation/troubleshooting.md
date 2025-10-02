# Troubleshooting

## Common issues & fixes

- **Port 8080 already in use**
  - Find the process using the port:
    ```bash
    lsof -i :8080
    ```
  - Stop or change the process or configure Jenkins to use a different port.

- **Java version mismatch**
  - Jenkins LTS typically requires Java 11 or later. Check:
    ```bash
    java -version
    ```

- **Permission errors writing to Jenkins home**
  - Ensure the `jenkins` user or your container volume has correct permissions:
    ```bash
    sudo chown -R jenkins:jenkins /var/jenkins_home
    ```

- **Initial admin password not found**
  - Make sure Jenkins finished initial setup and the `secrets/initialAdminPassword` file exists. For Docker, check the container's path.

- **Plugin installation fails**
  - Check network/proxy settings and increase the startup memory if needed.

If you want, I can expand any of these into step-by-step debugging instructions.
