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
    // Only main branch will run on a timer basis
    cron(env.BRANCH_NAME == 'main' ? '@weekly' : '')
  }
  stages {
    stage('Update APM Agent Dep') {
      when {
        branch 'main'
      }
      steps {
        withGithubNotify(context: 'Update Agent Dep') {
          gitCheckout(
            credentialsId: 'f6c7695a-671e-4f4f-a331-acdce44ff9ba',
            repo: 'git@github.com:elastic/opbeans-node.git',
            branch: 'main',
            basedir: BASE_DIR
          )
          dir(BASE_DIR){
            // gitCheckout() leaves the repo in a detached HEAD state. Move HEAD
            // back to the branch, so we can gitPush() below.
            sh(script: 'git checkout main')
            script {
              AVAIL_AGENT_UPDATE_VER = sh(
                  script: '.ci/avail-agent-update-ver.sh',
                  returnStdout: true
              ).trim()
              if (AVAIL_AGENT_UPDATE_VER) {
                echo "Available agent version update: '${AVAIL_AGENT_UPDATE_VER}'"
                sh(script: ".ci/bump-version.sh ${AVAIL_AGENT_UPDATE_VER}")
                gitPush()
                gitCreateTag(tag: "v${AVAIL_AGENT_UPDATE_VER}")
              } else {
                echo "This repo is already using the latest available APM agent version."
              }
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
