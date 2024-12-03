pipeline {
    agent {
        docker {
            image 'node:22.11.0-alpine3.20'
        }
    }

    options {
        skipStagesAfterUnstable()
        timestamps()
    }
    environment {
        NODE_ENV = 'prod'
        CI = 'true'
    }
    stages {
        stage('Ver images de docker') {
            agent any

            steps {
                sh 'docker images'
            }
        }

        stage('Instalar dependencias') {
            steps {
                echo 'Instalando dependencias del proyecto'
                sh '''
                if [ -d node_modules ]; then
                    echo "Usando cache de dependencias existente"
                else
                    npm ci  # Limpia y reinstala dependencias basado en package-lock.json
                fi
                '''
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                echo 'Ejecutando pruebas'
                sh 'npm test -- --ci'  // Forzar modo CI en Jest para evitar problemas
            }
        }
    }

    post {
        success {
            echo 'Las pruebas fueron exitosas.'
        }
        failure {
            echo 'Las pruebas fallaron.'
            script {
                currentBuild.result = 'FAILURE'
            }
        }
    }
}
