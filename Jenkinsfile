pipeline {
    agent {
        docker {
            image 'docker:24.0.5-dind'
            args '-v /var/run/docker.sock:/var/run/docker.sock --user root'
        }
    }
    stages {
        stage('Construir imagen de CNF') {
            steps {
                sh 'docker build -t cnf-firewall:1.0 .'
            }
        }

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

        stage('Instalar dependencias y ejecutar pruebas') {
            steps {
                script {
                    // Ejecutar en contenedor Docker con Node.js
                    sh '''
                        docker run --rm -v $(pwd):/app -w /app node:16 npm install
                        docker run --rm -v $(pwd):/app -w /app node:16 npm test
                    '''
                }
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
