import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { Construct } from "constructs";
import { IProject } from 'aws-cdk-lib/aws-codebuild';
import { Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { buildSpecObject } from './buildspec';
import { StackProps } from 'aws-cdk-lib';

/** Codebuild */
export class Codebuild extends Construct {
  // 外部からの参照用リソース
  readonly buildProject : IProject

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id);
    // Role
    const buildRole = new Role(this, 'Role', { assumedBy: new ServicePrincipal('codebuild.amazonaws.com') });
    // BuildProject
    const buildProject = new codebuild.PipelineProject(this, 'CodeBuild', {
      buildSpec: codebuild.BuildSpec.fromObjectToYaml(buildSpecObject),
      role: buildRole,
      environment: {
				buildImage: codebuild.LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-x86_64-standard:4.0'),
        privileged: false,
        environmentVariables: {
          AWS_ACCOUNT_ID: { 
            value: process.env.CDK_DEFAULT_ACCOUNT
          },
          CODEARTIFACT_REPO_URL: {
            value: `https://yoyoyo-pg-${process.env.CDK_DEFAULT_ACCOUNT}.d.codeartifact.ap-northeast-1.amazonaws.com/maven/gradle-publish-sample/`
          }
        }
			},
      description: 'gradle-sample'
		});
    // CodeArtifactAccessPolicy
    const codeArtifactAccessPolicy = new Policy(this, 'CodeArtifactAccessPolicy', { 
        policyName: 'codeArtifactAccessPolicy',
        statements: [
          new PolicyStatement({
            actions: [
              "codeartifact:GetAuthorizationToken",
              "codeartifact:GetRepositoryEndpoin",
              "codeartifact:ReadFromRepository",
              "codeartifact:PublishPackageVersion",
              "codeartifact:PutPackageMetadata",
            ],
            resources: ["*"]
          }),
          new PolicyStatement({
            actions: ["sts:GetServiceBearerToken"],
            resources: ["*"],
            conditions: {
              'StringEquals': {
                'sts:AWSServiceName': 'codeartifact.amazonaws.com',
              },
            },
          })
        ] 
    });
    buildRole.attachInlinePolicy(codeArtifactAccessPolicy);

    this.buildProject = buildProject;
	}
}