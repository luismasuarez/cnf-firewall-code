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
