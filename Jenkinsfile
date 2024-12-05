pipeline {
    agent none  // No usar un agente global

    options {
        skipStagesAfterUnstable()
        timestamps()
    }

    environment {
        NODE_ENV = 'prod'
        CI = 'true'
        DOCKER_IMAGE_NAME = 'luisma95/cnf-firewall'
        DOCKER_IMAGE_TAG = '1.0'
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

        stage('Construir imagen Docker') {
            agent any
            steps {
                echo 'Construyendo la imagen de Docker'
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
            }
        }

        stage('Publicar imagen en Docker Hub') {
            agent any
            environment {
                DOCKER_CREDS = credentials('dockerhub-credentials') // Secret de Docker Hub
            }
            steps {
                echo 'Publicando la imagen en Docker Hub'
                sh '''
                echo "${DOCKER_CREDS_PSW}" | docker login -u "${DOCKER_CREDS_USR}" --password-stdin
                docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado exitosamente y la imagen fue publicada.'
        }
        failure {
            echo 'Pipeline falló en alguna etapa.'
            script {
                currentBuild.result = 'FAILURE'
            }
        }
    }
}
