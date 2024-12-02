pipeline {
    agent {
        docker {
            image 'node:22.11.0-alpine3.20'
            args '-u 1000:1000 -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    stages {
        stage('Construir imagen Docker') {
            steps {
                echo 'Construyendo la imagen Docker...'
                sh 'docker build -t luismasuarezzz/cnf-firewall:1.0 .'
            }
        }
        stage('Eliminar imagen Docker') {
            steps {
                echo 'Eliminando la imagen Docker...'
                sh 'docker rmi luismasuarezzz/cnf-firewall:1.0 || true'
            }
        }
    }
    post {
        success {
            echo 'El pipeline se ejecutó correctamente.'
        }
        failure {
            echo 'El pipeline falló. Revisa los errores.'
        }
    }
}
