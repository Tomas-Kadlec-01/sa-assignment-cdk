import * as cdk from '@aws-cdk/core'
import { CustomVPC } from './constructs/vpc'
import { CustomAutoScalingGroup } from './constructs/ec2-autoscaling'
import { CustomApplicationLoadBalancer } from './constructs/alb'
import { config } from './config'

export class TKaSaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    // The code that defines your stack goes here

    // VPC -- fetch the custom VPC
    const customVPC = new CustomVPC(this, {
      prefix: config.projectName,
      cidr: '172.22.0.0/16',
    })

  

    // Application Loadbalancer -- for our single instance
    const { loadBalancerDnsName, listener } = new CustomApplicationLoadBalancer(this, {
      prefix: config.projectName,
      vpc: customVPC.vpc,
    })

 


    // EC2 -- create the static web instance in an autoscaling group
    const { asg } = new CustomAutoScalingGroup(this, {
      prefix: config.projectName,
      vpc: customVPC.vpc,
      dnsName: loadBalancerDnsName
    })

    // lets add our autoscaling group to our load balancer
    listener.addTargets(`${config.projectName}-wp-asg-targets`, {
      port: 80,
      targets: [asg]
    })
    
  }
}
