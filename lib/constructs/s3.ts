import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as s3 from '@aws-cdk/aws-s3'
import * as s3Deployment from '@aws-cdk/aws-s3-deployment'
import { config } from '../config'


/**
 * Creates a new custom S3
 *
 * @param  {cdk.Construct} scope stack application scope
 * @param  {StackProps} props props needed to create the resource
 *
 */
export class CustomS3 {
  public readonly customS3:s3.Bucket
  public readonly customDeployment:s3Deployment.BucketDeployment

  constructor(scope: cdk.Construct) {
    this.customS3 = new s3.Bucket(scope, `tka-sa-static-website-bucket`, {
      bucketName: config.bucketName,
      publicReadAccess:false,
      removalPolicy:cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects:true,
      websiteIndexDocument: 'index.html'
    })

    this.customDeployment = new s3Deployment.BucketDeployment(scope, 'tka-deploy-static-web', {
      sources: [
        s3Deployment.Source.asset('lib/website'),
        s3Deployment.Source.asset('lib/scripts')
      ],
      destinationBucket: this.customS3
    })
    
  }


}
