export const destination = {
  ID: 'random_id',
  Name: 'ninetailed',
  DestinationDefinition: {
    Config: {
      cdkV2Enabled: true,
    },
  },
  Config: {
    organisationId: 'dummyOrganisationId',
    environment: 'main',
  },
};

export const metadata = {
  destinationId: 'dummyDestId',
};
// export const endpoint = 'https://track.linksynergy.com/ep';
export const commonOutputHeaders = {
  accept: 'application/json',
  'content-type': 'application/json',
};
export const commonProperties = {
  segment: 'SampleSegment',
  shipcountry: 'USA',
  shipped: '20240129_1500',
  sitename: 'SampleSiteName',
  storeId: '12345',
  storecat: 'Electronics',
};
export const traits = {
  email: 'test@user.com',
  firstname: 'John',
  lastname: 'Doe',
  phone: '+1(123)456-7890',
  gender: 'Male',
  birthday: '1980-01-02',
  city: 'San Francisco',
};
