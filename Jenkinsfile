pipeline {
    agent none  // No usar un agente global

    options {
        skipStagesAfterUnstable()
        timestamps()
    }

    environment {
        DOCKER_IMAGE_NAME = 'luismasuarezzz/cnf-firewall'
        DOCKER_IMAGE_TAG = "lts-${BUILD_NUMBER}" // BUILD_NUMBER es el numero de ejecuciondel job de jenkins
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
                sh 'npm ci'
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
                sh 'npm test -- --ci'
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
            // Se deben definir en las credenciales globales de jenkins cada credencial para el servicio que haga falta
            environment {
                DOCKER_CREDS = credentials('dockerhub-credentials')
            }
            steps {
                echo 'Publicando la imagen en Docker Hub'
                sh '''
                echo "${DOCKER_CREDS_PSW}" | docker login -u "${DOCKER_CREDS_USR}" --password-stdin
                docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                docker rmi ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} || true
                '''
            }
        }

        stage('Disparar Despliegue en Kubernetes') {
            // Se pasa el parametro DOCKERTAG al job updatemanifest
            // para actualizar el manifiesto de despliegue de kuberneters
            steps {
                script {
                    echo 'Disparando job updatemanifest'
                    build job: 'updatemanifest', parameters: [string(name: 'DOCKERTAG', value: "${DOCKER_IMAGE_TAG}")                    ]
                }
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
