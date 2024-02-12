import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Codebuild } from './codebuild';
import { CodePipeline } from './codepipeline';
import { CodeArtifact } from './codeartifact';
import { CodeStar } from './codestar';

export class GradlePublishSampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);
    // Connection
    const codeStar = new CodeStar(this, 'CodeStar', {})
    // CodeArtifact
    new CodeArtifact(this, 'CodeArtifact', {});
    // CodeBuild
    const codeBuild = new Codebuild(this, 'CodeBuild', {});
    // CodePipeline
    new CodePipeline(this, 'CodePipeline', { 
      buildProject: codeBuild.buildProject,
      CfnConnection : codeStar.CfnConnection
    });
  }
}
