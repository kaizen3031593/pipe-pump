import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cw_actions from '@aws-cdk/aws-cloudwatch-actions';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';

export class CanaryStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const canary = new synthetics.Canary(this, 'test-pipeline', {
      test: synthetics.Test.custom({
        code: synthetics.Code.fromAsset(path.join(__dirname, '../canary')),
        handler: 'index.handler',
      }),
      schedule: synthetics.Schedule.once(),
    });

    const alarm = new cloudwatch.Alarm(this, 'pipelineAlarm', {
      metric: canary.metricSuccessPercent(),
      threshold: 90,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 2,
    });

    const topic = new sns.Topic(this, 'Topic', {
      displayName: 'My Pipeline Topic',
    });
    alarm.addAlarmAction(new cw_actions.SnsAction(topic));
  }
}
