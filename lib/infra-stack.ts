import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { rootCertificates } from 'tls';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // s3 bucket

    const balancestatuss3 = new s3.Bucket(this, 's3bucketlogicalider',{
      bucketName:'balancestatus8585',
    })
    // IAM Role
    const iambalancestatusrole = new iam.Role(this, "iambalanceroleer",{
      roleName: 'bankingLambdaRole85',
      description:'role for lambda to access s3 bucket',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    })
    iambalancestatusrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

    //lambda function

    const bankingLambdafunction = new lambda.Function(this, "lambdalogicalid",{
      handler: 'lambda_function.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code. fromAsset('../services/'),
      role: iambalancestatusrole,
    })

    //API Gateway

    const bankingrestapi = new apigateway.LambdaRestApi(this, "bankingrestapi",{
      handler: bankingLambdafunction,
      restApiName: 'bankingrestapi',
      deploy: true,
      proxy: false,
    })
    const bankstatus = bankingrestapi.root.addResource('bankstatus');
    bankstatus.addMethod('GET');

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
