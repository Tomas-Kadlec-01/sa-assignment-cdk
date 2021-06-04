import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'

interface StackProps {
  prefix: string
  cidr: string
}

/**
 * Creates a new custom VPC
 *
 * @param  {cdk.Construct} scope stack application scope
 * @param  {StackProps} props props needed to create the resource
 *
 */
export class CustomVPC {
  public readonly vpc: ec2.IVpc

  constructor(scope: cdk.Construct, props: StackProps) {
    this.vpc = new ec2.Vpc(scope, `${props.prefix}-vpc`, {
      maxAzs: 2, 
      cidr: props.cidr, 
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 1, 
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${props.prefix}-public-`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: `${props.prefix}-private-`,
          subnetType: ec2.SubnetType.PRIVATE,
        },
      ],
    })
    
  }
}
