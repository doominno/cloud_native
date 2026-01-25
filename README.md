
## Objetivos del Proyecto

1. Configurar un cluster Kubernetes local con K3s.
2. Desplegar MongoDB usando Helm y gestionarlo mediante Argo CD.
3. Configurar PMM para monitorización de la base de datos y métricas del cluster.
4. Versionar toda la infraestructura y configuraciones usando Git y GitHub.
5. Implementar un flujo de trabajo GitOps para que los cambios en Git se reflejen automáticamente en el cluster mediante Argo CD.

## Cómo usar este proyecto

1. Clonar el repositorio:
   ```bash
   git clone <URL-del-repo>
   cd cloud_native

# Proyecto Cloud Native

Este repositorio documenta el proceso de creación, configuración y despliegue de un cluster Kubernetes ligero con K3s, aplicaciones con Helm, monitorización con Percona PMM y flujo GitOps con Argo CD.

## 1. Instalación de herramientas

Se instalaron las herramientas necesarias:

```bash
sudo pacman -S kubectl    # Cliente de Kubernetes
sudo pacman -S helm       # Gestor de charts de Helm
sudo pacman -S terraform  # Infraestructura como código
sudo pacman -S mongosh    # Cliente de MongoDB
sudo pacman -S tree       # Para visualizar la estructura de carpetas
```

Además, se usó GitHub CLI para clonar y manejar el repositorio:

```bash
gh repo clone doominno/cloud_native
gh auth login
```

## 2. Cluster Kubernetes con K3s

Se instaló K3s y se configuró el entorno:

```bash
curl -sfL https://get.k3s.io | sh -
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl get nodes
sudo systemctl enable k3s
```

Se verificó el estado del cluster y los nodos:

```bash
kubectl get nodes
kubectl get namespaces
```

Se copió el archivo de configuración local para `kubectl`:

```bash
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
chown $(id -u):$(id -g) ~/.kube/config
chmod 644 ~/.kube/config
```

## 3. Infraestructura como código con Terraform

Se creó el directorio `infra/` y se configuró Terraform:

```bash
mkdir infra
cd infra
nano main.tf
terraform init
terraform apply
```

Se solucionaron problemas con submódulos de Git y se movió `infra/` a la raíz del proyecto.

## 4. Despliegue de aplicaciones con Helm

Se añadió y actualizó el repositorio Helm:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

Se instaló MongoDB en el namespace `production`:

```bash
helm install my-mongo bitnami/mongodb \
  --namespace production \
  --set auth.rootPassword=Usuario1. \
  --set auth.username=usuario \
  --set auth.password=Usuario1. \
  --set auth.databases[0]=miapp \
  --set auth.usernames[0]=usuario
```

Se obtuvo el manifiesto de Helm para versionarlo en Git:

```bash
helm get manifest my-mongo -n production > helm/my-mongo.yaml
git add helm/my-mongo.yaml
git commit -m "Add MongoDB Helm manifest"
git push origin main
```

## 5. Configuración de Argo CD para GitOps

Se creó el namespace y se desplegó Argo CD:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl port-forward svc/argocd-server -n argocd 8080:443
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```

Se obtuvo la contraseña inicial del admin de Argo CD:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## 6. Monitorización con Percona PMM

Se instaló el operador PMM y se configuró la monitorización:

```bash
kubectl apply -f https://raw.githubusercontent.com/percona/pmm-operator/main/deploy/operator.yaml
helm repo add percona https://percona.github.io/percona-helm-charts/
helm repo update
helm install pmm percona/pmm --namespace monitoring --create-namespace
kubectl port-forward svc/pmm 8080:80 -n monitoring
```

Se estableció la contraseña de administrador:

```bash
kubectl exec -n monitoring pmm-0 -- pmm-admin password set admin --password Usuario1.
```

Se añadieron servicios de MongoDB a PMM para monitorización, resolviendo problemas de autenticación.

## 7. Git y control de versiones

Se inicializó Git, se corrigieron submódulos y se versionaron archivos:

```bash
git init
git add .
git commit -m "Agregar archivos al repositorio"
git push origin main
```

Se documentaron los cambios en el README.md y se pusieron al repositorio remoto.

## 8. Estructura final del proyecto

```
cloud_native/
├── argocd/                # Configuración Argo CD
├── helm/                  # Charts y manifiestos Helm
│   └── my-mongo.yaml
├── infra/                 # Archivos de infraestructura Terraform
│   ├── main.tf
│   ├── terraform.tfstate
│   └── terraform.tfstate.backup
├── k3s.yaml               # Configuración del cluster K3s
├── k8s/                   # Manifiestos Kubernetes
└── README.md              # Documentación del proyecto
```

## 9. Flujo de trabajo

1. Hacer cambios en `infra/`, `helm/` o `k8s/`.
2. Hacer commit y push a GitHub.
3. Argo CD detecta los cambios y los aplica automáticamente en el cluster.
4. Verificar el estado de pods, servicios y monitorización:

```bash
kubectl get pods -n production
kubectl get pods -n monitoring
kubectl get svc -n argocd
```

---

Este README documenta todos los pasos realizados desde la instalación de herramientas hasta la configuración de GitOps y monitorización.
