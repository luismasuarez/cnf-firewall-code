## **Orquestar la imagen Docker `cnf-firewall:1.1` con Kubernetes**

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

```
pipeline {
    agent {
        docker {
            image 'docker:24.0.5-dind'
            args '-v /var/run/docker.sock:/var/run/docker.sock --user root'
        }
    }
    stages {
        stage('Comprobar archivos clonados') {
            steps {
                sh 'ls'
            }
        }

        stage('Comprobar versión de Docker') {
            steps {
                sh 'docker version'
            }
        }
    }

    post {
        always {
            // Pasos de limpieza, si es necesario
            echo 'Pipeline finalizada.'
        }
        success {
            echo 'Las pruebas fueron exitosas.'
        }
        failure {
            echo 'Las pruebas fallaron.'
        }
    }
}

```