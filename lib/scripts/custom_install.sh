#! /bin/bash

echo "Installing dependencies and http..."

yum -y update

# Install Apache
yum -y install httpd

# Start Apache
service httpd start

echo "All installed, http ready..."
