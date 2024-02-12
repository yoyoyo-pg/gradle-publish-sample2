import { StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CfnConnection } from 'aws-cdk-lib/aws-codestarconnections';

/** CodeStar */
export class CodeStar extends Construct {
  // 外部からの参照用リソース
  readonly CfnConnection : CfnConnection

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id);

    // Resources
    const codeStarConnection = new CfnConnection(this, 'Connection', {
      connectionName: 'yoyoyo-pg-connection',
      providerType: 'GitHub',
    });

    this.CfnConnection = codeStarConnection;
	}
}