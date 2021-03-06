import * as fs from 'fs'
import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as autoscaling from '@aws-cdk/aws-autoscaling'
import * as iam from '@aws-cdk/aws-iam'
import { config } from '../config'


interface StackProps {
  prefix: string
  vpc: ec2.IVpc
  dnsName: string
  
}

/**
 * Creates the EC2 AutoscalingGroup
 *
 * @param  {cdk.Construct} scope stack application scope
 * @param  {StackProps} props props needed to create the resource
 *
 */
export class CustomAutoScalingGroup {
  // export our newly created instance
  public readonly asg: autoscaling.AutoScalingGroup

  constructor(scope: cdk.Construct, props: StackProps) {
    // use the vpc we just created
    const customVPC = props.vpc

    // define a role for the wordpress instances
    const role = new iam.Role(scope, `${props.prefix}-instance-role`, {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ec2.amazonaws.com'),
        new iam.ServicePrincipal('ssm.amazonaws.com')
      ),
      managedPolicies: [
        // allows us to access instance via SSH using IAM and SSM
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonSSMManagedInstanceCore'
        ),
        // allows ec2 instance to access secrets maanger and retrieve secrets
        iam.ManagedPolicy.fromAwsManagedPolicyName('SecretsManagerReadWrite'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess')
      ],
    })

    // lets create a security group for the wordpress instances
    const securityGroup = new ec2.SecurityGroup(
      scope,
      'custom-instances-sg',
      {
        vpc: customVPC,
        allowAllOutbound: true,
        securityGroupName: 'custom-instances-sg',
      }
    )

    securityGroup.addIngressRule(
      ec2.Peer.ipv4(customVPC.vpcCidrBlock),
      ec2.Port.tcp(80),
      'Allows HTTP access from resources inside our VPC (like the ALB)'
    )

    // Fetch the user script from file system as a string
    const userScript = fs.readFileSync(
      'lib/scripts/custom_install.sh',
      'utf8'
    )



    // finally create and export out autoscaling group
    this.asg = new autoscaling.AutoScalingGroup(scope, `${props.prefix}-asg`, {
      vpc: customVPC,
      role,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      userData: ec2.UserData.custom(userScript),
      minCapacity: config.minSize,
      maxCapacity: config.maxSize,
      associatePublicIpAddress: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    })
  }
}
