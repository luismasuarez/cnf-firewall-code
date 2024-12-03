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

        stage('Generar imagen') {
            agent any

            steps {
                echo 'Construir Imagen'
                sh 'docker build -t cnf-firewall:1.0 .'
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
