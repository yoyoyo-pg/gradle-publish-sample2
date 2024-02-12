export const buildSpecObject = {
  version: 0.2,
  phases: {
    install: {
      'runtime-versions': {
        'java': 'corretto17',
      },
    },
    pre_build: {
      'on-failure': 'ABORT',
      'commands': [
        'export CODEARTIFACT_AUTH_TOKEN=`aws codeartifact get-authorization-token --domain yoyoyo-pg --domain-owner $AWS_ACCOUNT_ID --region ap-northeast-1 --query authorizationToken --output text`',
        'export CODEARTIFACT_REPO_URL=$CODEARTIFACT_REPO_URL'
      ]
    },
    build: {
      'on-failure': 'ABORT',
      'commands': [
        'cd $CODEBUILD_SRC_DIR/gradle-sample',
        'gradle publishAllPublicationsToMavenRepository'
      ]
    },
  },
}