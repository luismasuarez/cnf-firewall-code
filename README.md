## **Orquestar la imagen Docker `cnf-firewall:lts-BUILD_NUMBER` con Kubernetes**

Este tutorial te enseñará a desplegar una aplicación Dockerizada en Kubernetes utilizando **Minikube**. También puedes adaptarlo para herramientas similares como **Kind** (Kubernetes IN Docker). Aquí, configuraremos un clúster de Kubernetes local, empaquetaremos tu aplicación como una imagen Docker, y la desplegaremos en Kubernetes.

---

### **1. Empaquetar tu aplicación Express en Docker**

Si tu aplicación usa Express (por ejemplo, `server.js`), necesitas un archivo `Dockerfile` y un `package.json` para construir la imagen.

#### **Paso 1.1: Crear el archivo `package.json`**
El archivo `package.json` gestiona las dependencias de tu aplicación Node.js.

1. En el directorio de tu aplicación, crea `package.json`:
   ```json
   {
     "name": "cnf-firewall",
     "version": "1.0.0",
     "description": "Aplicación Express con un cortafuegos simulado",
     "main": "server.js",
     "scripts": {
       "start": "node server.js"
     },
     "dependencies": {
       "express": "^4.18.2"
     }
   }
   ```

#### **Paso 1.2: Crear el archivo `Dockerfile`**
El `Dockerfile` describe cómo se construirá la imagen Docker.

1. Crea un archivo `Dockerfile` en el mismo directorio:
   ```dockerfile
   # Imagen base oficial de Node.js
   FROM node:18-alpine

   # Crear y establecer el directorio de trabajo dentro del contenedor
   WORKDIR /usr/src/app

   # Copiar los archivos para instalar las dependencias
   COPY package*.json ./

   # Instalar las dependencias
   RUN npm install

   # Copiar el código de la aplicación
   COPY . .

   # Exponer el puerto donde corre la app
   EXPOSE 5000

   # Comando para iniciar la aplicación
   CMD ["npm", "start"]
   ```

#### **Paso 1.3: Construir y probar la imagen Docker**
Con los archivos listos, construye tu imagen Docker:

1. Construir la imagen:
   ```bash
   docker build -t cnf-firewall:1.1 .
   ```

2. Probar localmente:
   ```bash
   docker run -p 5000:5000 cnf-firewall:1.1
   ```
   Accede a tu aplicación en [http://localhost:5000](http://localhost:5000).

---

### **2. Subir la imagen a un registro de Docker**
Para usar Kubernetes, la imagen debe estar disponible en un registro como Docker Hub.

1. Inicia sesión en Docker Hub:
   ```bash
   docker login
   ```

2. Etiqueta la imagen:
   ```bash
   docker tag cnf-firewall:1.1 <nombre_repositorio_docker_hub>/cnf-firewall:tagname
   ```

3. Sube la imagen:
   ```bash
   docker push <nombre_repositorio_docker_hub>/cnf-firewall:tagname
   ```

---

### **3. Configurar Minikube**

#### **Paso 3.1: Instalar Minikube**
Sigue las instrucciones de la [documentación oficial](https://minikube.sigs.k8s.io/docs/):
- **macOS/Linux:** Usa Homebrew:
  ```bash
  brew install minikube
  ```
- **Windows:** Usa Chocolatey:
  ```bash
  choco install minikube
  ```

#### **Paso 3.2: Iniciar Minikube**
Inicia el clúster de Minikube:
```bash
minikube start
```

#### **Paso 3.3: Verificar la instalación**
Comprueba que el clúster esté funcionando:
```bash
kubectl get nodes
```
#### **Paso 3.3: Error de autenticacion**
Actualiza el contexto e inicialo para kubectl:
```bash
minikube update-context
```
#### **Paso 3.3: Error de servicio**
Error de servicio
```bash
 minikube image load cnf-firewall:1.0
 ```

---

### **4. Crear un despliegue Kubernetes**

#### **Paso 4.1: Archivo de despliegue `deployment.yaml`**
Crea un archivo `deployment.yaml` para describir cómo Kubernetes ejecutará tu aplicación.

1. Ejemplo de despliegue:
   ```yaml
   apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: cnf-firewall-deployment
      labels:
        app: cnf-firewall
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: cnf-firewall
      template:
        metadata:
          labels:
            app: cnf-firewall
        spec:
          containers:
          - name: cnf-firewall
            image: cnf-firewall:1.0
            ports:
            - containerPort: 5000
            resources:
              limits:
                memory: "512Mi"
                cpu: "500m"
              requests:
                memory: "256Mi"
                cpu: "250m"
   ```

2. Aplicar el despliegue:
   ```bash
   kubectl apply -f deployment.yaml
   ```

#### **Paso 4.2: Crear un servicio para exponer la aplicación**
Crea un archivo `service.yaml` para exponer tu aplicación a través de un servicio `NodePort`.

1. Ejemplo de servicio:
   ```yaml
   apiVersion: v1
    kind: Service
    metadata:
      name: cnf-firewall-service
      labels:
        app: cnf-firewall
    spec:
      type: NodePort
      ports:
      - port: 5000
        targetPort: 5000
        nodePort: 30001
      selector:
        app: cnf-firewall
   ```

2. Aplicar el servicio:
   ```bash
   kubectl apply -f service.yaml
   ```

---

### **5. Probar la aplicación en Minikube**

#### **Paso 5.1: Acceder al servicio**
Usa el comando de Minikube para abrir el servicio en tu navegador:
```bash
minikube service cnf-firewall-service
```

#### **Paso 5.2: Verificar el estado de los pods**
Comprueba que los pods y servicios están funcionando:
```bash
kubectl get pods
kubectl get services
```

---

### **6. Integrar con Docker Hub (opcional)**
Asegúrate de usar la ruta completa de la imagen en tus archivos YAML, por ejemplo:
```yaml
image: <usuario_docker>/cnf-firewall:1.1
```
Esto permite a Kubernetes descargar la imagen desde Docker Hub automáticamente.

---

Con estos pasos, habrás desplegado y orquestado tu aplicación `cnf-firewall:1.1` en Kubernetes usando Minikube. 🎉 ¡Ahora tu aplicación está lista para manejar tráfico y escalar en un clúster Kubernetes!

### Instalacion de ArgoCD

1. Crear un namespace con kuberneters para argocd

```bash
kubectl create namespace argocd
```

2. Aplicar el manifiesto de despliegue para argocd en el namespace creado

```bash 
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

3. Descargar el instalador de ArgoCD

```bash
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
```

4. Instalar ArgoCD

```bash
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
```

5. Acceder a Argo CD API Server en este caso mediante Port Forwarding

```bash
kubectl port-forward svc/argocd-server -n argocd 9000:443
```

Acceder a la interfaz visual en: https://localhost:9000/, esto dara aviso de sitio no seguno, se le da continuar al sitio para acceder.

5. Al abrir la pagina web poner las credenciales: 

- Usuario por defecto es `admin`
- La contraseña se obtiene con el comando:
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```
al ejecutar el comando se vera de esta manera
```bash
luisma@DESKTOP-6C81CKL ~> kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

dhZ4CmOlDSVC0VzC
```
Esta contraseña se puede cambiar una ves iniciada la sesion en la web local

6. Para configurar una nueva app mediante un repositorio privado deben agregarse las credenciales

- Hacer login mediante la consola, con el usuario `admin` y la contraseña que se tenga en cada caso
- 
```bash
argocd login localhost:9000
```

- Agregar el repositorio y sus credenciales por consola
- 
```bash
argocd repo add http://gitea.net/gitea/updatemanifest.git --username gitea --password password
```

se obtendra algo asi 
```bash
luisma@DESKTOP-6C81CKL ~> argocd repo add http://gitea.net/gitea/updatemanifest.git --username gitea --password password
Repository 'http://gitea.net/gitea/updatemanifest.git' added
```

7. Comprobar el repositorio agregado

```bash
luisma@DESKTOP-6C81CKL ~> argocd repo list
TYPE  NAME  REPO                                       INSECURE  OCI    LFS    CREDS  STATUS      MESSAGE  PROJECT
git         http://gitea.net/gitea/updatemanifest.git  false     false  false  true   Successful
```

8. Acceder al servicio orquestado por ArgoCD

```bash
kubectl port-forward svc/cnf-firewall-service 5000:80
```