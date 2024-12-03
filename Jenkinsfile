pipeline {
    agent none  // No usar un agente global

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
            agent {
                docker {
                    image 'docker:24.0.5-dind'
                    args '--privileged -v /var/run/docker.sock:/var/run/docker.sock --user root'  // Privilegios de Docker
                }
            }
            steps {
                sh 'docker images'  // Ver imágenes en el contenedor
            }
        }

        stage('Instalar dependencias') {
            agent {
                docker {
                    image 'node:22.11.0-alpine3.20'
                }
            }
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
            agent {
                docker {
                    image 'node:22.11.0-alpine3.20'
                }
            }
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
