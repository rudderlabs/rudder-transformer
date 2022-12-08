const storedPayload = {
  data: {
    type: "customer",
    id: "58210c3db0f09110006b7953",
    attributes: {
      name: "AnnoD",
      displayName: "AnnoD",
      displayColor: "yellow",
      displayIcon: "flower",
      externalId: "annodD",
      externalIds: [
        {
          externalId: "annodD",
          verified: true,
          id: null
        }
      ],
      sharedExternalIds: [],
      signedUpAt: null,
      avatarUrl: null,
      username: null,
      emails: [
        {
          email: "annod@kustomer.com",
          verified: true,
          type: "home",
          id: null
        }
      ],
      sharedEmails: [
        {
          email: "annod@kustomer.com",
          verified: false,
          type: "home",
          id: null
        }
      ],
      phones: [],
      sharedPhones: [],
      socials: [],
      sharedSocials: [],
      urls: [],
      locations: [],
      activeUsers: [],
      watchers: [],
      recentLocation: {
        updatedAt: "2016-11-07T23:22:01.746Z"
      },
      locale: null,
      timeZone: null,
      birthdayAt: null,
      gender: null,
      presence: "offline",
      createdAt: "2016-11-07T23:20:29.080Z",
      updatedAt: "2016-11-09T04:47:07.036Z",
      modifiedAt: "2016-11-09T04:47:07.036Z",
      lastSeenAt: "2016-11-07T23:23:51.582Z",
      lastActivityAt: "2016-11-09T04:47:07.036Z",
      lastCustomerActivityAt: "2016-11-07T23:23:51.582Z",
      lastMessageIn: {
        sentAt: "2016-11-07T23:22:02.281Z",
        sentiment: null
      },
      lastConversation: {
        id: "58210c99b0f09110006b7969",
        sentiment: {
          confidence: 0.649023,
          polarity: 1
        },
        tags: []
      },
      conversationCounts: {
        all: 3,
        snoozed: 0,
        open: 2,
        done: 1
      },
      preview: {
        previewAt: "2016-11-07T23:23:26.039Z",
        type: "message_out",
        text: "dfsd fsdsfdsfdsf",
        subject: "Hi, do you guys have an XXL hoodie"
      },
      tags: [],
      sentiment: {
        polarity: 1,
        confidence: 0.649023
      },
      progressiveStatus: "open",
      verified: true,
      rev: 37
    },
    relationships: {
      org: {
        links: {
          self: "/v1/orgs/57f29863a1dbf61100e6aa92"
        },
        data: {
          type: "org",
          id: "57f29863a1dbf61100e6aa92"
        }
      },
      messages: {
        links: {
          self: "/v1/customers/58210c3db0f09110006b7953/messages"
        }
      },
      modifiedBy: {
        links: {
          self: "/v1/users/58190b991f2932100010d683"
        },
        data: {
          type: "user",
          id: "58190b991f2932100010d683"
        }
      }
    },
    links: {
      self: "/v1/customers/58210c3db0f09110006b7953"
    }
  }
};

const kustomerGetRequestHandler = url => {
  switch (url) {
    case "https://api.kustomerapp.com/v1/customers/externalId=annodD":
      //resolve with status 200
      return { data: storedPayload, status: 200 };
    default:
      return new Promise((resolve, reject) => {
        resolve({ error: "Request failed", status: 404 });
      });
  }
};

module.exports = kustomerGetRequestHandler;
