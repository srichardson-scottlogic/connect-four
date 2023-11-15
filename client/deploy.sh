#!/bin/bash

CLUSTER_NAME="Connect-Four-Cluster"
SERVICE_NAME="Connect-Four-Service"
REGION="eu-north-1"

aws ecs wait services-stable --services "$SERVICE_NAME" --cluster "$CLUSTER_NAME" --region "$REGION"

TASK_ARN=$(aws ecs list-tasks --cluster "$CLUSTER_NAME" --service-name "$SERVICE_NAME" --region "$REGION" --query 'taskArns[0]' --output text)

TASK_DETAILS=$(aws ecs describe-tasks --task "${TASK_ARN}" --cluster "$CLUSTER_NAME" --region "$REGION" --query 'tasks[0].attachments[0].details')
ENI=$(echo "$TASK_DETAILS" | jq -r '.[] | select(.name=="networkInterfaceId").value')
IP=$(aws ec2 describe-network-interfaces --network-interface-ids "${ENI}" --region "$REGION" --query 'NetworkInterfaces[0].Association.PublicIp' --output text)

export REACT_APP_WS_URL='ws://'"$IP"':8080'
echo 'Deploying client to S3 with WS url: '"$REACT_APP_WS_URL"

npm run build
aws s3 sync build s3://connect-four-srichardson