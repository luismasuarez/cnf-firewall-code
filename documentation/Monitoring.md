# Configuracion de Prometheus y Grafana en un cluster local de kuberneters con minikube

## Requisitos

### Cluster Local de Kuberneters (Minikube)

Minikube es una herramienta que permite ejecutar un clúster de Kubernetes local en tu computadora. Es ideal para aprender, desarrollar y probar aplicaciones en un entorno Kubernetes sin necesidad de configurar un clúster completo en la nube o en servidores físicos.

- ¿Por qué usar Minikube?
  - Es una forma económica de practicar y aprender Kubernetes.
  - Ideal para desarrolladores que necesitan probar aplicaciones en un clúster local antes de desplegarlas en producción.
  - Puedes realizar pruebas de integración y despliegues sin costos adicionales de infraestructura en la nube.

#### ***Instalacion de Minikube***

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```
#### ***Iniciar el Cluster***

```bash
minikube start
```
#### ***Completar mas pasos aca***
[minikube start](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download)

### Helm

Helm es una herramienta de gestión de paquetes para Kubernetes. Se utiliza para simplificar la implementación y administración de aplicaciones en un clúster de Kubernetes mediante el uso de charts. Los charts son paquetes predefinidos que contienen todos los recursos necesarios para implementar una aplicación o servicio en Kubernetes.

- ¿Por qué usar Helm?
  - Reduce la complejidad al implementar aplicaciones complejas con muchos recursos.
  - Facilita la gestión de configuraciones y despliegues en múltiples entornos.
  - Mejora la reproducibilidad de los despliegues.

#### ***Instalacion de Helm***

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```
#### ***Comprobar Instalacion***

```bash
helm version
```

se debe ver algo asi
```bash
luisma@DESKTOP-6C81CKL ~> helm version
version.BuildInfo{Version:"v3.16.3", GitCommit:"cfd07493f46efc9debd9cc1b02a0961186df7fdf", GitTreeState:"clean", GoVersion:"go1.22.7"}
```
#### ***Ver los repositorios agregados***

```bash
helm repo list
```

## Instalacion de Prometheus

Prometheus es una herramienta de monitoreo y alerta de código abierto diseñada específicamente para sistemas distribuidos y basados en contenedores, como los que se implementan en Kubernetes. Es muy popular por su capacidad de recolectar, almacenar y consultar métricas en tiempo real, así como de generar alertas basadas en reglas configuradas.

- ¿Por qué usar Prometheus?
  - Monitoreo avanzado de infraestructura y aplicaciones en tiempo real.
  - Sistema confiable y escalable diseñado para entornos modernos (microservicios, Kubernetes).
  - Alertas personalizadas que permiten reaccionar rápidamente a problemas.

### Agregar el repositorio para Prometheus Community

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

### Instalar Prometheus

```bash
helm install prometheus prometheus-community/prometheus --namespace monitoring --create-namespace
```
### Comprobar Instalacion

```bash
kubectl get all -n monitoring
```
### Acceder a la WEB

```bash
kubectl --namespace monitoring port-forward svc/prometheus-server 9091:80 &
```

## Instalacion de Grafana

Grafana es una plataforma de visualización y análisis de datos de código abierto. Se utiliza para crear paneles interactivos y visualizaciones que permiten monitorizar métricas, logs y eventos en tiempo real desde diferentes fuentes de datos. Es especialmente popular en combinación con herramientas de monitoreo como Prometheus, pero también es compatible con muchas otras fuentes.

- ¿Por qué usar Grafana?
  - Es una herramienta versátil para la monitorización y análisis de datos en sistemas complejos como Kubernetes.
  - Su interfaz amigable y flexible facilita la creación de dashboards atractivos y útiles.
  - Compatible con múltiples herramientas, lo que permite consolidar métricas, logs y datos en un solo lugar.

### Agregar el repositorio de Grafana

```bash
helm repo add grafana https://grafana.github.io/helm-charts
```
### Instalar Grafana

```bash
helm install grafana grafana/grafana --namespace monitoring
```
### Comprobar Instalacion

```bash
kubectl get all -n monitoring
```
### Obtener la clave para iniciar sesion en la WEB

```bash
kubectl get secret --namespace monitoring grafana -o jsonpath="{.data.admin-password}" | ba
se64 --decode ; echo
```

### Acceder a la WEB

```bash
kubectl --namespace monitoring port-forward svc/grafana 3002:80 &
```

### Agregar Prometheus como fuente de datos de Grafana mediente un ConfigMap en Kuberneters

***ConfigMap***

Un ConfigMap en Kubernetes es un recurso que se utiliza para almacenar información de configuración en formato clave-valor. Permite separar la configuración de una aplicación del código de la misma, lo que facilita su manejo, reutilización y actualización sin necesidad de reconstruir las imágenes de los contenedores.

- ¿Cuándo usar un ConfigMap?
  - Cuando necesitas gestionar configuraciones específicas por entorno (desarrollo, staging, producción).
  - Si quieres evitar incluir configuraciones directamente en tus imágenes Docker.
  - Para centralizar y compartir configuraciones entre diferentes aplicaciones o servicios en el clúster.

#### Crear el manifiesto del ConfigMap `grafana.yaml`

```yaml
# grafana.yaml

apiVersion: 1
datasources: 
  - name: Prometheus
    type: prometheus
    url: http://prometheus-server:80
    access: proxy
    isDefault: true
```

#### Crear el ConfigMap

```bash
kubectl create configmap grafana-datasources --from-file=datasources.yaml=grafana.yaml -n monitoring
```

#### Modificar el deployment de Grafana para que se adapte al ConfigMap creado

1. Verificar los deployments 

```bash
kubectl get deployments -n monitoring
```
2. Recuperar el deployment de Grafana

```bash
kubectl get deployment grafana -n monitoring -o yaml > grafana-deployment.yaml
```
3. Agregar un volumen al manifiesto `grafana-deployment.yaml`

ejemplo:

```yaml
      volumes:
       ...
# Aqui va el nuevo volumen
      - name: grafana-datasources
        configMap:
          name: grafana-datasources
```

4. Definir como se monta ese volumen dentro del contenedor de grafana

ejemplo:

```yaml
        volumenMounts:
        ...
# Aqui va la nueva ruta
        - name: grafana-datasources
          mountPath: /etc/grafana/provisioning/datasources
```

5. Volver a desplegar el `grafana-deployment.yaml`

```bash
kubectl apply -f grafana-deployment.yaml
```

6. Acceder a la WEB nuevamente, y ya debe aparecer prometheus como fuente de datos

```bash
kubectl --namespace monitoring port-forward svc/grafana 3002:80 &
```

7. Agregar un Dashboard para la visualizacion de metricas de un cluster de Kuberneters, al estar en la seccion de dashboard se selecciona importar y se escribe el numero 3119 y luego al boton Load. Una ves en la seccion seleccionar la fuente de datos a mostrar