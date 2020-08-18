import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';

export class PipeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'GreetLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      handler: 'hello.handler',
    });

    // Add API gateways for the lambda backend
    new apigw.LambdaRestApi(this, 'Endpoint', {
      description: 'first endpoint',
      handler: hello,
    });
  }
}
