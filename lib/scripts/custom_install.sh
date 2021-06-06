#! /bin/bash

echo "Installing dependencies and http..."

yum -y update

# Install Apache
yum -y install httpd

# Start Apache
service httpd start

# Start Cron
service crond start

cd /var/www/html
aws s3 cp s3://tka-sa-cdk-bucket-15-6-2021/index.html /var/www/html

cd /tmp
touch schedule
echo "aws s3 cp s3://tka-sa-cdk-bucket-15-6-2021/index.html /var/www/html" > /tmp/schedule.sh

chmod +x /tmp/schedule.sh

echo "* * * * * root /tmp/schedule.sh" > /etc/cron.d/schedule
chmod 600 /etc/cron.d/schedule

echo "All installed, http ready..."