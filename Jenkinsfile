pipeline {
    agent { docker { image 'docker:24.0.5-dind' } }
    stages {
        stage('Comprobar version los archhivos clonados') {
            steps {
                sh 'ls'
            }
        }

        stage('Comprobar version de NodeJS') {
            steps {
                sh 'docker version'
            }
        }
    }
}