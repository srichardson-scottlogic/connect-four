#! bash

aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 032044580362.dkr.ecr.eu-west-2.amazonaws.com 
docker build -t connect-four . 
docker tag connect-four:latest 032044580362.dkr.ecr.eu-west-2.amazonaws.com/connect-four:latest 
docker push 032044580362.dkr.ecr.eu-west-2.amazonaws.com/connect-four:latest

aws ecs update-service --cluster arn:aws:ecs:eu-north-1:032044580362:cluster/Connect-Four-Cluster --service arn:aws:ecs:eu-north-1:032044580362:service/Connect-Four-Cluster/Connect-Four-Service --region "eu-north-1" --force-new-deployment --query "service.deployments[0].id"