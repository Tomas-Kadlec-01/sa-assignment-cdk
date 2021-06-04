import * as dotenv from 'dotenv'

dotenv.config()

const stage = process.env.STAGE || 'dev'

export const config = {
  projectName: `tka-sa-cdk`,
  userName: `tomas-kadlec`,
  maxSize: 1,
  stage,
  env: {
    account: process.env.AWS_ACCOUNT_NUMBER,
    region: 'eu-west-1',
  },
  deployedBy: process.env.USER || 'tomas-kadlec'
  
}