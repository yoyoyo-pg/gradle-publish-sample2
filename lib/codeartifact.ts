import * as codeartifact from 'aws-cdk-lib/aws-codeartifact';
import { Construct } from "constructs";
import { StackProps } from 'aws-cdk-lib';

/** CodeArtifact */
export class CodeArtifact extends Construct {
	constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);
    // CodeArtifact domain
    const codeArtifactDomain = new codeartifact.CfnDomain(this, 'Domain', {domainName: 'yoyoyo-pg'});
    // Maven Repo
    const MavenCentralRepo = new codeartifact.CfnRepository(this, 'MavenCentral', {
      repositoryName: 'maven-central-store',
      description: 'Provides Maven artifacts from Maven Central Repository.',
      externalConnections: ['public:maven-central'],
      domainName: codeArtifactDomain.attrName,
    });
    // Maven Repo
    const MavenPrivateRepo = new codeartifact.CfnRepository(this, 'GradleSample', {
      upstreams: [MavenCentralRepo.attrName],
      repositoryName: 'gradle-publish-sample',
      description: 'gradle publish repository',
      domainName: codeArtifactDomain.attrName,
    });
  }
}