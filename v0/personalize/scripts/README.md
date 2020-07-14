# Instructions to Run `create-trackingid.js`

In order to configure AWS Personalize as a destination in RudderStack, you need to first generate a tracking ID. Running this script allows you to do so.

Please follow these steps:

- Download the script locally.

- To run the script import `aws-sdk` and `readline-sync`.
  - `npm install aws-sdk`
  - `npm install readline-sync`

- Run the script
`node create-trackingid.js`

- In the console you will be asked to enter the following:
  - Access Key ID
  - Secret Access Key
  - Region
  - Name of Dataset Group 
  - Number of fields you need in the AVRO SCHEMA in addition to already required fields : `USER_ID`,`TIMESTAMP`,`ITEM_ID`
  - Name of the other fields
  - Type of other fields

- As an ouput, you will get all the ARNs of Dataset Group, Dataset, Schema, and Event Tracker.
- You will also get the tracking ID as an output. Please note this tracking ID down.

## About Avro Schema

Avro schemas are defined using JSON. The schemas are composed of primitive types (null, boolean, int, long, float, double, bytes, and string) and complex types (record, enum, array, map, union, and fixed).

Learn more about the Avro Schemas [here](https://avro.apache.org/docs/current/spec.html).

# Contact Us
In case you come across any issues while running this script, please feel free to [contact us](https://rudderstack.com/contact/). You can also chat with us on our [Discord](https://discordapp.com/invite/xNEdEGw) channel.
