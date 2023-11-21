
const destinationName = 'MARKETO';
const definition = await DestinationDefinitionRepository.findOne({
    name: destinationName,
});

if (!definition) {
    throw new NotFoundError(`${destinationName} destination not found`);
}

const destinations = await DestinationRepository.findMany(
    { destinationDefinitionId: definition.id, deleted: false },
    ['updatedBy'],
);

const outputDestinations: Struct<Destination>[] = [];

for (const destination of destinations) {
    const { config } = destination;
    const rudderEventsMapping: { event: any; marketoPrimarykey: any; marketoActivityId: any; }[] = [];
    const activityPrimaryKeyMap: { [key: string]: string } = {};
    const activityEventMap: { [key: string]: string } = {};
    if (config.customActivityPrimaryKeyMap) {
        config.customActivityPrimaryKeyMap.forEach((item: { from: string; to: string }) => {
            activityPrimaryKeyMap[item.from] = item.to;
        });
    }
    if (config.customActivityEventMap) {
        config.customActivityEventMap.forEach((item: { from: string; to: string }) => {
            activityEventMap[item.from] = item.to;
        });
    }
    Object.keys(activityEventMap).forEach(event => {
        const marketoActivityId = activityEventMap[event];
        let marketoPrimarykey;
        if (activityPrimaryKeyMap[event]) {
            marketoPrimarykey = activityPrimaryKeyMap[event];
            delete activityPrimaryKeyMap[event]
        }
        rudderEventsMapping.push({ event, marketoPrimarykey, marketoActivityId });
    })
    Object.keys(activityPrimaryKeyMap).forEach(event => {
        const marketoPrimarykey = activityPrimaryKeyMap[event];
        rudderEventsMapping.push({ event, marketoPrimarykey, marketoActivityId: undefined });
    })
    const updatedObj: Partial<Destination> = {
        config: { rudderEventsMapping: rudderEventsMapping },
    };

    if (!dryRun && Object.keys(updatedObj.config).length > 0) {
        await DestinationRepository.update(destination, updatedObj);
    }
    outputDestinations.push(merge(cloneDeep(destination), updatedObj));
}

return outputDestinations;
