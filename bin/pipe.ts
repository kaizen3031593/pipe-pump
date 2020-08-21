#!/usr/bin/env node
import { Construct, SecretValue, Stage, Stack, StackProps, StageProps, App, CfnOutput } from '@aws-cdk/core';
import { PipeStack } from '../lib/pipe-stack';
import { CanaryStack } from '../lib/canary-stack';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

const awsAccount = '489318732371';
const githubUsername = 'kaizen3031593';
const githubRepo = 'pipe-pump';

class MyApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps){
    super(scope, id, props);

    new PipeStack(this, 'api-endpoint');
  }
}

class MyTest extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps){
    super(scope, id, props);

    new CanaryStack(this, 'test-endpoint');
  }
}

class MyProdApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps){
    super(scope, id, props);

    new PipeStack(this, 'prod-endpoint');
  }
}

class MyPipelinestack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      cloudAssemblyArtifact,
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('GithubToken'),
        owner: githubUsername,
        repo: githubRepo,
      }),
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
      })
    });  

    pipeline.addApplicationStage(new MyApp(this, 'Sandbox', {
      env: {
        account: awsAccount,
        region: 'us-east-1',
      }
    }));

    pipeline.addApplicationStage(new MyTest(this, 'Test', {
      env: {
        account: awsAccount,
        region: 'us-east-1',
      }
    }));

    pipeline.addApplicationStage(new MyProdApp(this, 'Prod', {
      env: {
        account: awsAccount,
        region: 'us-east-1',
      }
    }));
  }
}

const app = new App();
new MyPipelinestack(app, 'PipelineStack', {
  env: {
    account: awsAccount,
    region: 'us-east-1',
  }
});
