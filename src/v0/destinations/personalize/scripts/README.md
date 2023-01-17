#Instructions to run create-trackingid.js

This is a script that you can run if you want to create a tracking id which is needed while creating a destination for AWS Personalize in RudderStack automatically.

Download the script in local.

To run the script import aws-sdk and readline-sync.
npm install aws-sdk
npm install readline-sync

Run the script
node create-trackingid.js

In the console it will ask your:

1. Access Key ID
2. Secret Access Key
3. Region
4. Name of Dataset Group
5. Number of Fields you need in the AVRO SCHEMA in addition to already required Fields : USER_ID,TIMESTAMP,ITEM_ID
6. Name of the other fields
7. Type of other fields.

About Avro Schema:

Avro schemas are defined using JSON. Schemas are composed of primitive types (null, boolean, int, long, float, double, bytes, and string)and complex types (record, enum, array, map, union, and fixed)

In the ouput you will get all the ARNs of Dataset Group, Dataset, Schema, Event Tracker.
Also Tracking Id will be an output.
Please note that down for future use.
