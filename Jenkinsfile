pipeline {
  agent any

  environment {
    IMAGE = "node-api"
    TAG = "${env.BUILD_NUMBER}"
    REGISTRY = ""         // optional
    DOCKERHUB_CRED = ""   // optional credentialsId
    SONARQUBE_SERVER = "SonarQubeServer" // if you have SonarQube configured
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build') {
      steps {
        sh 'node -v && npm -v'
        sh 'npm ci'
        sh 'npm run build'
        sh 'docker build -t ${IMAGE}:${TAG} .'
        archiveArtifacts artifacts: 'Dockerfile, package.json, **/*.js, tests/**', fingerprint: true
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
        junit 'junit.xml'
      }
      post {
        always {
          recordCoverage(
            tools: [coberturaAdapter('coverage/cobertura-coverage.xml')],
            sourceFileResolver: sourceFiles('STORE_LAST_BUILD'),
            failNoReports: false
          )
        }
      }
    }

    stage('Code Quality') {
      when { expression { return fileExists('sonar-project.properties') } }
      steps {
        withSonarQubeEnv("${SONARQUBE_SERVER}") {
          sh '''
            if [ -f node_modules/.bin/sonar-scanner ]; then
              npx sonar-scanner
            else
              npx --yes sonar-scanner
            fi
          '''
        }
      }
    }

    stage('Security') {
      steps {
        sh 'npm run audit'
        sh 'docker run --rm -v $PWD:/src aquasec/trivy:latest fs /src || true'
      }
    }

    stage('Deploy (Staging)') {
      steps {
        sh 'TAG=${TAG} NODE_ENV=staging docker compose up -d --build'
        sh 'curl -fsS http://localhost:3000/health'
      }
    }

    stage('Release (Approve)') {
      steps {
        timeout(time: 10, unit: 'MINUTES') {
          input message: "Promote build ${TAG} to PRODUCTION?", ok: 'Release'
        }
      }
    }

    stage('Deploy (Production)') {
      steps {
        sh 'TAG=${TAG} NODE_ENV=production docker compose up -d --build'
        sh 'curl -fsS http://localhost:3000/health'
      }
    }

    stage('Monitoring & Alerting') {
      steps {
        sh 'curl -fsS http://localhost:3000/metrics | head -n 20 || true'
        echo 'Hook this stage to Prometheus scrape or Datadog agent for bonus marks.'
      }
    }
  }

  post {
    always  { echo 'Pipeline run finished.' }
    failure { echo '❌ Pipeline failed. Check logs above.' }
    success { echo "✅ Pipeline OK: ${env.BUILD_TAG}" }
  }
}