pipeline {
    agent {
        docker {
            image 'node:22.11.0-alpine3.20'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Comprobar version los archhivos clonados') {
            steps {
                sh 'ls'
            }
        }

        stage('Comprobar version de NodeJS') {
            steps {
                sh 'node --version'
            }
        }

        stage('Comprobar version de Docker') {
            steps {
                sh 'docker version'
            }
        }
    }
}