#!/usr/bin/env node
import { Construct, SecretValue, Stage, Stack, StackProps, StageProps, App } from '@aws-cdk/core';
import { PipeStack } from '../lib/pipe-stack';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';

class MyApp extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps){
    super(scope, id, props);

    new PipeStack(this, 'api-endpoint');
  }
}

class MyPipelinestack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, "Pipeline", {
      pipelineName: 'TestPipeline',
      cloudAssemblyArtifact,
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: "GitHub",
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('GithubToken'),
        owner: "kaizen3031593",
        repo: "pipe-pump",
      }),
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
      })
    });

    pipeline.addApplicationStage(new MyApp(this, 'prod', {
      env: {
        account: '489318732371',
        region: 'us-east-1',
      }
    }));
  }
}

const app = new App();
new MyPipelinestack(app, 'PipelineStack', {
  env: {
    account: '489318732371',
    region: 'us-east-1',
  }
});
