# Jenkins Installation on Kubernetes

## Prerequisites
- Kubernetes cluster (minikube, kind, EKS, GKE, AKS, etc.)
- kubectl configured
- Helm installed

---

## Steps (using Helm chart)

1. Add Jenkins Helm repository:
   ```bash
   helm repo add jenkinsci https://charts.jenkins.io
   helm repo update
   ```

2. Install Jenkins:
   ```bash
   helm install jenkins jenkinsci/jenkins
   ```

3. Check status:
   ```bash
   kubectl get pods
   ```

4. Get Jenkins admin password:
   ```bash
   printf $(kubectl get secret jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode);echo
   ```

5. Access Jenkins:
   - If using Minikube:
     ```bash
     minikube service jenkins
     ```
   - Otherwise, expose the service with LoadBalancer or Ingress.

---

✅ Jenkins is now deployed on Kubernetes.
