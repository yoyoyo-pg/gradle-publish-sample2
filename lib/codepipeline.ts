import { Construct } from "constructs";
import { CfnConnection } from 'aws-cdk-lib/aws-codestarconnections';
import { CodeStarConnectionsSourceAction, CodeBuildAction, CodeBuildActionType } from 'aws-cdk-lib/aws-codepipeline-actions';
import { IProject } from 'aws-cdk-lib/aws-codebuild';
import { Artifact, Pipeline } from "aws-cdk-lib/aws-codepipeline";

/** 入力インターフェース */
export interface constructProps  {
  buildProject : IProject;
  CfnConnection : CfnConnection
}

/** Codepipeline */
export class CodePipeline extends Construct {
	constructor(scope: Construct, id: string, props: constructProps) {
		super(scope, id);
 		// アーティファクト定義
		const sourceOutput = new Artifact(); // SourceAction
		const buildOutput = new Artifact(); // BuildAction
    // CodePipeline
		new Pipeline(this, 'Pipeline', {
			crossAccountKeys: false,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new CodeStarConnectionsSourceAction({
              actionName: 'Source',
              owner: 'yoyoyo-pg',
              repo: 'gradle-publish-sample',
              branch: 'main',
              output: sourceOutput,
              connectionArn: props.CfnConnection.attrConnectionArn,
              triggerOnPush: true,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new CodeBuildAction({
              actionName: 'Build',
              input: sourceOutput,
              project: props.buildProject,
              type: CodeBuildActionType.BUILD,
              outputs: [buildOutput]
            }),
          ],
        }
      ]
		});
	}
}