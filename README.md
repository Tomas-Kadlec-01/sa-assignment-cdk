# CDK version of SA assignment

## Functionality & improvements
The new version allows user friendly web site update via periodic synchronization with S3 bucket. Web server content is updated in max. 1 minute after upload of the new content to the S3 bucket.

## Install steps:
* Create arbitrary directory on your local filesystem
* Clone repo: git clone https://github.com/Tomas-Kadlec-01/sa-assignment-cdk.git
* Install project CDK dependencies (npm install)
* Check your local AWS CLI setting and connection profile
* Optionally parametrize lib/config.ts (**Dont change name of the bucket**)
* run command cdk deploy

## Prerequisities:
* Configured, working AWS CLI with active AWS account
* Installed NPM/Node.js runtime
* Globally installed AWS CDK Runtime NPM module (npm i -g aws-cdk)

## Known limitations
* The S3 bucket name is fixed to the value: **tka-sa-cdk-bucket-15-6-2021**
