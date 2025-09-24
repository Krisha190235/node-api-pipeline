pipeline {
    agent any

    options {
        ansiColor('xterm')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    sh '''
                        node -v
                        npm -v
                        npm ci
                        npm run build
                        docker build -t node-api:${BUILD_NUMBER} .
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                wrap([$class: 'AnsiColorBuildWrapper', 'colorMapName': 'xterm']) {
                    sh 'npm test'
                }
            }
            post {
                always {
                    junit 'junit.xml'
                    recordCoverage(
                        tools: [coberturaAdapter('coverage/cobertura-coverage.xml')],
                        sourceDirectories: [[path: 'src']],
                        failOnError: false
                    )
                }
            }
        }

        stage('Code Quality') {
            when {
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                echo '🔍 Running code quality checks (e.g., lint)...'
                sh 'npm run lint || true'
            }
        }

        stage('Security') {
            when {
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                echo '🔒 Running security scans...'
                sh 'npm audit || true'
            }
        }

        stage('Deploy (Staging)') {
            when {
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                echo '🚀 Deploying to staging environment...'
            }
        }

        stage('Release (Approve)') {
            steps {
                input message: 'Approve release to production?', ok: 'Release'
            }
        }

        stage('Deploy (Production)') {
            steps {
                echo '🚀 Deploying to production environment...'
            }
        }

        stage('Monitoring & Alerting') {
            steps {
                echo '📊 Updating monitoring dashboards and alerts...'
            }
        }
    }

    post {
        always {
            echo 'Pipeline run finished.'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
    }
}