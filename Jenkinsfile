pipeline {
    agent none
    stages {
        stage('Build') {
            steps {
                sh 'docker ps'  // Fallará si no hay un nodo asignado con Docker.
            }
        }
    }
}
