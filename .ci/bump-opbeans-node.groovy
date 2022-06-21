#!/usr/bin/env groovy
@Library('apm@current') _

// Periodically check if there is an available newer APM agent version, e.g.
// "1.2.3". If so, then update to it and tag this repo with that version, e.g.
// "v1.2.3".
pipeline {
  agent { label 'linux && immutable' }
  environment {
    BASE_DIR = 'src/github.com/elastic'
    NOTIFY_TO = credentials('notify-to')
    PIPELINE_LOG_LEVEL = 'INFO'
    PATH = "${env.PATH}:${env.WORKSPACE}/bin"
    HOME = "${env.WORKSPACE}"
  }
  options {
    timeout(time: 10, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '20', daysToKeepStr: '30'))
    timestamps()
    ansiColor('xterm')
    disableResume()
    durabilityHint('PERFORMANCE_OPTIMIZED')
    rateLimitBuilds(throttle: [count: 60, durationName: 'hour', userBoost: true])
    quietPeriod(10)
    disableConcurrentBuilds(abortPrevious: isPR())
  }
  triggers {
    issueCommentTrigger('/trent-test-build')
  }
  stages {
    stage('Update APM Agent Dep') {
      steps {
        withGithubNotify(context: 'Update Agent Dep') {
          sh(script: 'pwd')
          sh(script: 'ls -al')
          sh(script: 'git status')
          sh(script: 'git branch')
          sh(script: 'git config user.email')
          script {
            AVAIL_AGENT_UPDATE_VER = sh(
                script: '.ci/avail-agent-update-ver.sh',
                returnStdout: true
            ).trim()
            if (AVAIL_AGENT_UPDATE_VER) {
              echo "Available agent version update: '${AVAIL_AGENT_UPDATE_VER}'"
              sh(script: ".ci/bump-version.sh ${AVAIL_AGENT_UPDATE_VER}")
              sh(script: "git diff")
            } else {
              echo "This repo is already using the latest available APM agent version."
            }
          }
        }
      }
    }
  }
  post {
    always {
      notifyBuildResult()
    }
  }
}
