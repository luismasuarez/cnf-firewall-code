pipeline {
    agent {
        docker {
            image 'docker:24.0.5-dind'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
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
}
