# Welcome to Pipe Pump

This is my practice with CDK Pipelines along with the new CDK CloudWatch Synthetics module, introduced in version 1.59.

To use, you must be signed in to your AWS account and have followed `bootstrapping` instructions [here](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/pipelines#cdk-environment-bootstrapping).

Make sure you follow the `initial pipeline deployment` instructions [here](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/pipelines#initial-pipeline-deployment).

You will likely have to change details in the code for account. You'll also have to change the source stage in the pipeline from my Github to yours, following these [steps](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-codepipeline-actions#github).

The general structure of the pipeline is Source -> Build -> Update Pipeline -> Assets -> Sandbox -> Test -> Prod

This project uses the AWS CDK, along with AWS CodePipeline, AWS Lambda, AWS ApiGateway, AWS CloudWatch Synthetics, and AWS Simple Notification Service.

Happy piping!
