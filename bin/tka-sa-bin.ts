#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TKaSaStack } from '../lib/tka-sa-stack';
import { config } from '../lib/config';

const app = new cdk.App();
new TKaSaStack(app, 'TKaSaStack', {
  env: config.env,
  description: `Deploys resources for SA assignment: ${config.userName}`,
  tags: { Project: config.projectName, Deployedby: config.deployedBy } 
});
