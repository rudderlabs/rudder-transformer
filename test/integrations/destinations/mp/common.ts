const defaultMockFns = () => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(Date.UTC(2020, 0, 25)).valueOf());
};

const sampleDestination = {
    Config: {
        apiKey: 'dummyApiKey',
        token: 'dummyApiKey',
        prefixProperties: true,
        useNativeSDK: false,
    },
    DestinationDefinition: {
        DisplayName: 'Mixpanel',
        ID: '1WhbSZ6uA3H5ChVifHpfL2H6sie',
        Name: 'MP',
    },
    Enabled: true,
    ID: '1WhcOCGgj9asZu850HvugU2C3Aq',
    Name: 'MP',
    Transformations: [],
};

const getDestination = (configValues) => {
    const destination = Object.assign({}, sampleDestination, { Config: configValues });
    return destination;
};

export { sampleDestination, defaultMockFns, getDestination }