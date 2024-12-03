pipeline {
    agent {
        docker {
            image 'node:22.11.0-alpine3.20' // Imagen específica para garantizar consistencia
        }
    }
    options {
        skipStagesAfterUnstable() // Salta etapas posteriores si alguna es inestable
        timestamps() // Agrega timestamps para un mejor debugging
    }
    environment {
        NODE_ENV = 'prod' // Configuración global para evitar modificaciones locales
        CI = 'true' // Indica que el entorno es de integración continua
    }
    stages {
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
                sh 'npm test -- --ci' // Forzar modo CI en Jest para evitar problemas
            }
        }

        stage('Analizar resultados (opcional)') {
            when {
                expression { return fileExists('coverage') } // Verifica si existe cobertura
            }
            steps {
                echo 'Generando reporte de cobertura'
                sh 'npm run coverage' // Ejecuta un script opcional para análisis
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado.'
            archiveArtifacts artifacts: '**/logs/**/*.log', allowEmptyArchive: true // Guarda logs
        }
        success {
            echo 'Las pruebas fueron exitosas.'
        }
        failure {
            echo 'Las pruebas fallaron.'
            script {
                currentBuild.result = "FAILURE"
            }
        }
    }
}
