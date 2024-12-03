pipeline {
    agent { docker { image 'node:22.11.0-alpine3.20' } }

    stages {
        stage('Verificar versión de Node.js') {
            steps {
                sh 'node --version'  // Verifica la versión de Node.js
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'  // Instalar dependencias del proyecto
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                sh 'npm test'  // Ejecutar las pruebas definidas en el proyecto
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado.'
        }
        success {
            echo 'Las pruebas fueron exitosas.'
        }
        failure {
            echo 'Las pruebas fallaron.'
        }
    }
}
