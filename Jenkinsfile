pipeline {
    agent { docker { image 'node:22.11.0-alpine3.20' } }

    environment {
        DOCKER_IMAGE = 'luismasuarezzz/cnf-firewall:1.0' // Ajusta según tu preferencia
    }

    stages {
        stage('Preparar') {
            steps {
                echo 'Preparando el entorno...'
                // Obtén el código fuente del repositorio
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                echo 'Instalando dependencias de Node.js...'
                sh '''
                npm install
                '''
            }
        }

        stage('Construir imagen Docker') {
            steps {
                echo 'Construyendo la imagen Docker...'
                sh '''
                docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Eliminar imagen Docker') {
            steps {
                echo 'Eliminando la imagen Docker localmente...'
                sh '''
                docker rmi $DOCKER_IMAGE
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado con éxito.'
        }
        failure {
            echo 'El pipeline falló. Revisa los errores.'
        }
    }
}
