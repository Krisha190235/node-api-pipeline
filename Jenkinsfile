pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    DOCKER_BUILDKIT = '1'
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
          // produce Cobertura XML so Jenkins can read it
          sh 'npm test -- --coverage --coverageReporters=cobertura --coverageReporters=text-summary'
        }
      }
      post {
        always {
          // Pick up any junit XML if you generate it (safe if none exist)
          junit allowEmptyResults: true, testResults: 'reports/junit/**/*.xml'

          // ✅ Coverage plugin — Cobertura adapter (correct symbol is `cobertura`)
          recordCoverage(
            tools: [cobertura(pattern: 'coverage/cobertura-coverage.xml')],
            sourceDirectories: ['src'],
            failOnError: false
          )

          // keep artifacts for later inspection
          archiveArtifacts allowEmptyArchive: true, artifacts: 'coverage/**, reports/**, **/Dockerfile'
        }
      }
    }

    stage('Code Quality') {
      when { expression { false } }  // placeholder
      steps { echo 'Add ESLint/Sonar here' }
    }

    stage('Security') {
      when { expression { false } }
      steps { echo 'Add npm audit/trivy here' }
    }

    stage('Deploy (Staging)') {
      when { expression { false } }
      steps { echo 'Deploy placeholder' }
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
      echo '✅ Pipeline succeeded.'
    }
  }
}