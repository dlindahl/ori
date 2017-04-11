#!/bin/bash
echo ""
echo ""
echo "#######################################"
echo "#                                     #"
echo "# ATTENTION: This command will ask a  #"
echo "# series of questions that will be    #"
echo "# incorporated into the certificate.  #"
echo "#                                     #"
echo "# The following is a list of values   #"
echo "# you should use in response.         #"
echo "#                                     #"
echo "#######################################"
echo ""
echo ""
echo "Country Name: US"
echo "State or Province Name (full name): Virginia"
echo "Locality Name (eg, city): Reston"
echo "Organization Name (eg, company) [Internet Widgits Pty Ltd]: Emerging Technology Advisors"
echo "Organizational Unit Name (eg, section) []: hq"
echo "Common Name (e.g. server FQDN or YOUR name) []: Ori"
echo "Email Address []: ops@eta.im"
echo ""
echo ""
echo "Generating RSA Public/Private Key Pairs..."
echo ""
echo ""

openssl genrsa -out jira_privatekey.pem 1024
openssl req -newkey rsa:1024 -x509 -key jira_privatekey.pem -out jira_publickey.cer -days 365
openssl pkcs8 -topk8 -nocrypt -in jira_privatekey.pem -out jira_privatekey.pcks8
openssl x509 -pubkey -noout -in jira_publickey.cer > jira_publickey.pem
