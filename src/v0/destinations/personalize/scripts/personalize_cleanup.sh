#!/bin/bash

# Set the AWS region
AWS_REGION="us-east-1"

# Function to wait for dataset deletion
wait_for_deletion() {
  local resource_arn=$1
  local resource_type=$2
  local status=""

  echo "Waiting for $resource_type $resource_arn to be deleted..."

  while true; do
    if [ "$resource_type" == "dataset" ]; then
      status=$(aws personalize describe-dataset --dataset-arn $resource_arn --region $AWS_REGION --query "dataset.status" --output text 2>/dev/null)
    fi

    if [ -z "$status" ]; then
      echo "$resource_type $resource_arn has been deleted."
      break
    else
      echo "$resource_type $resource_arn status: $status. Waiting..."
      sleep 10
    fi
  done
}

# Delete dataset groups
for dataset_group_arn in $(aws personalize list-dataset-groups --region $AWS_REGION --query "datasetGroups[*].datasetGroupArn" --output text); do

  echo "Processing dataset group: $dataset_group_arn"

  # List and delete all event trackers in the dataset group
  for event_tracker_arn in $(aws personalize list-event-trackers --dataset-group-arn $dataset_group_arn --region $AWS_REGION --query "eventTrackers[*].eventTrackerArn" --output text); do
    echo "Deleting event tracker $event_tracker_arn"
    aws personalize delete-event-tracker --event-tracker-arn $event_tracker_arn --region $AWS_REGION
  done

  # List and delete all solutions in the dataset group
  for solution_arn in $(aws personalize list-solutions --dataset-group-arn $dataset_group_arn --region $AWS_REGION --query "solutions[*].solutionArn" --output text); do

    # List and delete all campaigns for the solution
    for campaign_arn in $(aws personalize list-campaigns --solution-arn $solution_arn --region $AWS_REGION --query "campaigns[*].campaignArn" --output text); do
      echo "Deleting campaign $campaign_arn"
      aws personalize delete-campaign --campaign-arn $campaign_arn --region $AWS_REGION
    done

    echo "Deleting solution $solution_arn"
    aws personalize delete-solution --solution-arn $solution_arn --region $AWS_REGION
  done

  # List and delete all datasets in the dataset group
  for dataset_arn in $(aws personalize list-datasets --dataset-group-arn $dataset_group_arn --region $AWS_REGION --query "datasets[*].datasetArn" --output text); do
    echo "Deleting dataset $dataset_arn"
    aws personalize delete-dataset --dataset-arn $dataset_arn --region $AWS_REGION
    wait_for_deletion $dataset_arn "dataset"
  done

  # Finally, delete the dataset group
  echo "Deleting dataset group $dataset_group_arn"
  aws personalize delete-dataset-group --dataset-group-arn $dataset_group_arn --region $AWS_REGION
  wait_for_deletion $dataset_group_arn "dataset_group"
done

echo "All datasets, event trackers, solutions, campaigns, and dataset groups have been deleted."

