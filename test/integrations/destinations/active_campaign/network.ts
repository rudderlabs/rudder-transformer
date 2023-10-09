export const networkCallsData = [
  {
    httpReq: {
      data: {
        contact: {
          email: 'jamesDoe@gmail.com',
          firstName: 'James',
          lastName: 'Doe',
          phone: '92374162212',
        },
      },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contact/sync',
    },
    httpRes: {
      data: {
        contact: {
          cdate: '2018-09-28T13:50:41-05:00',
          email: 'jamesDoe@gmail.com',
          id: '2',
          links: {
            bounceLogs: 'https://:account.api-us1.com/api/:version/contacts/113/bounceLogs',
            contactAutomations:
              'https://:account.api-us1.com/api/:version/contacts/113/contactAutomations',
            contactData: 'https://:account.api-us1.com/api/:version/contacts/113/contactData',
            contactDeals: 'https://:account.api-us1.com/api/:version/contacts/113/contactDeals',
            contactGoals: 'https://:account.api-us1.com/api/:version/contacts/113/contactGoals',
            contactLists: 'https://:account.api-us1.com/api/:version/contacts/113/contactLists',
            contactLogs: 'https://:account.api-us1.com/api/:version/contacts/113/contactLogs',
            contactTags: 'https://:account.api-us1.com/api/:version/contacts/113/contactTags',
            deals: 'https://:account.api-us1.com/api/:version/contacts/113/deals',
            fieldValues: 'https://:account.api-us1.com/api/:version/contacts/113/fieldValues',
            geoIps: 'https://:account.api-us1.com/api/:version/contacts/113/geoIps',
            notes: 'https://:account.api-us1.com/api/:version/contacts/113/notes',
            organization: 'https://:account.api-us1.com/api/:version/contacts/113/organization',
            plusAppend: 'https://:account.api-us1.com/api/:version/contacts/113/plusAppend',
            scoreValues: 'https://:account.api-us1.com/api/:version/contacts/113/scoreValues',
            trackingLogs: 'https://:account.api-us1.com/api/:version/contacts/113/trackingLogs',
          },
          organization: '',
          orgid: '',
          udate: '2018-09-28T13:50:41-05:00',
        },
        fieldValues: [
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '1',
            id: '11797',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11797/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11797/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: 'The Value for First Field',
          },
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '6',
            id: '11798',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11798/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11798/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: '2008-01-20',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/tags?limit=100',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 200,
    },
  },
  {
    httpReq: {
      data: { tag: { description: '', tag: 'Test_User', tagType: 'contact' } },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/tags',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          description: '',
          id: 1,
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
          tag: 'Test_User',
          tagType: 'contact',
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { tag: { description: '', tag: 'Interested_User', tagType: 'contact' } },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/tags',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          description: '',
          id: 2,
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
          tag: 'Interested_User',
          tagType: 'contact',
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: '5' } },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 3,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: '5',
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: 1 } },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 4,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: 1,
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: 2 } },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 5,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: 2,
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 2, status: '1' } },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 2, status: '1' } }, status: 200 },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 3, status: '2' } },
      headers: {
        'Api-Token': 'dummyApiToken',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 3, status: '2' } }, status: 200 },
  },
  {
    httpReq: {
      headers: { Accept: 'application/json, text/plain, */*', 'Api-Token': 'dummyApiToken' },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/fields?limit=100',
    },
    httpRes: {
      data: {
        fieldOptions: [],
        fieldRels: [],
        fields: [
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Random  description',
            id: '4',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Random',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Likes  description',
            id: '3',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Likes',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:43:38-06:00',
            cols: '0',
            defval: null,
            descript: null,
            id: '2',
            isrequired: '0',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/2/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/2/relations',
            },
            options: [],
            ordernum: '2',
            perstag: 'ANOTHER_TEST_TITLE',
            relations: [],
            rows: '0',
            service: '',
            show_in_list: '0',
            title: 'Another Test Title',
            type: '',
            udate: '2018-11-15T21:43:38-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Country  description',
            id: '1',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Country',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Office  description',
            id: '0',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Office',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
        ],
        meta: { total: '4' },
      },
      status: 200,
    },
  },
  {
    httpReq: {
      data: {
        contact: {
          email: 'jamesDoe@gmail.com',
          firstName: 'James',
          lastName: 'Doe',
          phone: '92374162212',
        },
      },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contact/sync',
    },
    httpRes: {
      data: {
        contact: {
          cdate: '2018-09-28T13:50:41-05:00',
          email: 'jamesDoe@gmail.com',
          id: '2',
          links: {
            bounceLogs: 'https://:account.api-us1.com/api/:version/contacts/113/bounceLogs',
            contactAutomations:
              'https://:account.api-us1.com/api/:version/contacts/113/contactAutomations',
            contactData: 'https://:account.api-us1.com/api/:version/contacts/113/contactData',
            contactDeals: 'https://:account.api-us1.com/api/:version/contacts/113/contactDeals',
            contactGoals: 'https://:account.api-us1.com/api/:version/contacts/113/contactGoals',
            contactLists: 'https://:account.api-us1.com/api/:version/contacts/113/contactLists',
            contactLogs: 'https://:account.api-us1.com/api/:version/contacts/113/contactLogs',
            contactTags: 'https://:account.api-us1.com/api/:version/contacts/113/contactTags',
            deals: 'https://:account.api-us1.com/api/:version/contacts/113/deals',
            fieldValues: 'https://:account.api-us1.com/api/:version/contacts/113/fieldValues',
            geoIps: 'https://:account.api-us1.com/api/:version/contacts/113/geoIps',
            notes: 'https://:account.api-us1.com/api/:version/contacts/113/notes',
            organization: 'https://:account.api-us1.com/api/:version/contacts/113/organization',
            plusAppend: 'https://:account.api-us1.com/api/:version/contacts/113/plusAppend',
            scoreValues: 'https://:account.api-us1.com/api/:version/contacts/113/scoreValues',
            trackingLogs: 'https://:account.api-us1.com/api/:version/contacts/113/trackingLogs',
          },
          organization: '',
          orgid: '',
          udate: '2018-09-28T13:50:41-05:00',
        },
        fieldValues: [
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '1',
            id: '11797',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11797/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11797/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: 'The Value for First Field',
          },
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '6',
            id: '11798',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11798/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11798/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: '2008-01-20',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 2, status: '1' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 2, status: '1' } }, status: 200 },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 3, status: '2' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 3, status: '2' } }, status: 200 },
  },
  {
    httpReq: {
      headers: { Accept: 'application/json, text/plain, */*', 'Api-Token': 'dummyApiKey' },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/fields?limit=100',
    },
    httpRes: {
      data: {
        fieldOptions: [],
        fieldRels: [],
        fields: [
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Random  description',
            id: '4',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Random',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Likes  description',
            id: '3',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Likes',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:43:38-06:00',
            cols: '0',
            defval: null,
            descript: null,
            id: '2',
            isrequired: '0',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/2/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/2/relations',
            },
            options: [],
            ordernum: '2',
            perstag: 'ANOTHER_TEST_TITLE',
            relations: [],
            rows: '0',
            service: '',
            show_in_list: '0',
            title: 'Another Test Title',
            type: '',
            udate: '2018-11-15T21:43:38-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Country  description',
            id: '1',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Country',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Office  description',
            id: '0',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Office',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
        ],
        meta: { total: '4' },
      },
      status: 200,
    },
  },
  {
    httpReq: {
      data: {
        contact: {
          email: 'jamesDoe@gmail.com',
          firstName: 'James',
          lastName: 'Doe',
          phone: '92374162212',
        },
      },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contact/sync',
    },
    httpRes: {
      data: {
        contact: {
          cdate: '2018-09-28T13:50:41-05:00',
          email: 'jamesDoe@gmail.com',
          id: '2',
          links: {
            bounceLogs: 'https://:account.api-us1.com/api/:version/contacts/113/bounceLogs',
            contactAutomations:
              'https://:account.api-us1.com/api/:version/contacts/113/contactAutomations',
            contactData: 'https://:account.api-us1.com/api/:version/contacts/113/contactData',
            contactDeals: 'https://:account.api-us1.com/api/:version/contacts/113/contactDeals',
            contactGoals: 'https://:account.api-us1.com/api/:version/contacts/113/contactGoals',
            contactLists: 'https://:account.api-us1.com/api/:version/contacts/113/contactLists',
            contactLogs: 'https://:account.api-us1.com/api/:version/contacts/113/contactLogs',
            contactTags: 'https://:account.api-us1.com/api/:version/contacts/113/contactTags',
            deals: 'https://:account.api-us1.com/api/:version/contacts/113/deals',
            fieldValues: 'https://:account.api-us1.com/api/:version/contacts/113/fieldValues',
            geoIps: 'https://:account.api-us1.com/api/:version/contacts/113/geoIps',
            notes: 'https://:account.api-us1.com/api/:version/contacts/113/notes',
            organization: 'https://:account.api-us1.com/api/:version/contacts/113/organization',
            plusAppend: 'https://:account.api-us1.com/api/:version/contacts/113/plusAppend',
            scoreValues: 'https://:account.api-us1.com/api/:version/contacts/113/scoreValues',
            trackingLogs: 'https://:account.api-us1.com/api/:version/contacts/113/trackingLogs',
          },
          organization: '',
          orgid: '',
          udate: '2018-09-28T13:50:41-05:00',
        },
        fieldValues: [
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '1',
            id: '11797',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11797/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11797/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: 'The Value for First Field',
          },
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '6',
            id: '11798',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11798/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11798/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: '2008-01-20',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/tags?limit=100',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 200,
    },
  },
  {
    httpReq: {
      data: { tag: { description: '', tag: 'Test_User', tagType: 'contact' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/tags',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          description: '',
          id: 6,
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
          tag: 'Test_User',
          tagType: 'contact',
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { tag: { description: '', tag: 'Interested_User', tagType: 'contact' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/tags',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          description: '',
          id: 7,
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
          tag: 'Interested_User',
          tagType: 'contact',
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: '5' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 8,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: '5',
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: 6 } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 9,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: 6,
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: 7 } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 10,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: 7,
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 2, status: '1' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 2, status: '1' } }, status: 200 },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 3, status: '2' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 3, status: '2' } }, status: 200 },
  },
  {
    httpReq: {
      headers: { Accept: 'application/json, text/plain, */*', 'Api-Token': 'dummyApiKey' },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/fields?limit=100',
    },
    httpRes: {
      data: {
        fieldOptions: [],
        fieldRels: [],
        fields: [
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Random  description',
            id: '4',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Random',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Likes  description',
            id: '3',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Likes',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:43:38-06:00',
            cols: '0',
            defval: null,
            descript: null,
            id: '2',
            isrequired: '0',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/2/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/2/relations',
            },
            options: [],
            ordernum: '2',
            perstag: 'ANOTHER_TEST_TITLE',
            relations: [],
            rows: '0',
            service: '',
            show_in_list: '0',
            title: 'Another Test Title',
            type: '',
            udate: '2018-11-15T21:43:38-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Country  description',
            id: '1',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Country',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Office  description',
            id: '0',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Office',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
        ],
        meta: { total: '4' },
      },
      status: 200,
    },
  },
  {
    httpReq: {
      headers: {
        'Api-Token': 'dummyApiKey',

        'Content-Type': 'application/json',
      },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/eventTrackingEvents',
    },
    httpRes: {
      data: {
        eventTrackingEvents: [{ name: '__pagevisit' }, { name: '__redir' }],
        meta: { total: 2 },
      },
      status: 200,
    },
  },
  {
    httpReq: {
      data: { eventTrackingEvent: { name: 'ScreenViewed' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/eventTrackingEvents',
    },
    httpRes: { data: { eventTrackingEvent: { name: 'ScreenViewed' } }, status: 201 },
  },
  {
    httpReq: {
      headers: { 'Api-Token': 'dummyApiKey', Accept: 'application/json, text/plain, */*' },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/eventTrackingEvents',
    },
    httpRes: {
      data: {
        eventTrackingEvents: [{ name: '__pagevisit' }, { name: '__redir' }],
        meta: { total: 2 },
      },
      status: 200,
    },
  },
  {
    httpReq: {
      data: { eventTrackingEvent: { name: 'Tracking Action' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/eventTrackingEvents',
    },
    httpRes: { data: { eventTrackingEvent: { name: 'Tracking Action' } }, status: 201 },
  },
  {
    httpReq: {
      data: { contact: { email: 'jamesDoe@gmail.com', phone: '92374162212' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contact/sync',
    },
    httpRes: {
      data: {
        contact: {
          cdate: '2018-09-28T13:50:41-05:00',
          email: 'jamesDoe@gmail.com',
          id: '2',
          links: {
            bounceLogs: 'https://:account.api-us1.com/api/:version/contacts/113/bounceLogs',
            contactAutomations:
              'https://:account.api-us1.com/api/:version/contacts/113/contactAutomations',
            contactData: 'https://:account.api-us1.com/api/:version/contacts/113/contactData',
            contactDeals: 'https://:account.api-us1.com/api/:version/contacts/113/contactDeals',
            contactGoals: 'https://:account.api-us1.com/api/:version/contacts/113/contactGoals',
            contactLists: 'https://:account.api-us1.com/api/:version/contacts/113/contactLists',
            contactLogs: 'https://:account.api-us1.com/api/:version/contacts/113/contactLogs',
            contactTags: 'https://:account.api-us1.com/api/:version/contacts/113/contactTags',
            deals: 'https://:account.api-us1.com/api/:version/contacts/113/deals',
            fieldValues: 'https://:account.api-us1.com/api/:version/contacts/113/fieldValues',
            geoIps: 'https://:account.api-us1.com/api/:version/contacts/113/geoIps',
            notes: 'https://:account.api-us1.com/api/:version/contacts/113/notes',
            organization: 'https://:account.api-us1.com/api/:version/contacts/113/organization',
            plusAppend: 'https://:account.api-us1.com/api/:version/contacts/113/plusAppend',
            scoreValues: 'https://:account.api-us1.com/api/:version/contacts/113/scoreValues',
            trackingLogs: 'https://:account.api-us1.com/api/:version/contacts/113/trackingLogs',
          },
          organization: '',
          orgid: '',
          udate: '2018-09-28T13:50:41-05:00',
        },
        fieldValues: [
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '1',
            id: '11797',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11797/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11797/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: 'The Value for First Field',
          },
          {
            cdate: '2020-08-01T10:54:59-05:00',
            contact: '113',
            field: '6',
            id: '11798',
            links: {
              field: 'https://:account.api-us1.com/api/3/fieldValues/11798/field',
              owner: 'https://:account.api-us1.com/api/3/fieldValues/11798/owner',
            },
            owner: '113',
            udate: '2020-08-01T14:13:34-05:00',
            value: '2008-01-20',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/tags?limit=100',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 200,
    },
  },
  {
    httpReq: {
      data: { tag: { description: '', tag: 'Test_User', tagType: 'contact' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/tags',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          description: '',
          id: 11,
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
          tag: 'Test_User',
          tagType: 'contact',
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { tag: { description: '', tag: 'Interested_User', tagType: 'contact' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/tags',
    },
    httpRes: {
      data: {
        meta: { total: '5' },
        tag: {
          cdate: '2018-09-29T19:21:25-05:00',
          description: '',
          id: 12,
          links: {
            contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/16/contactGoalTags',
          },
          tag: 'Interested_User',
          tagType: 'contact',
        },
        tags: [
          {
            cdate: '2018-08-17T09:43:15-05:00',
            description: '',
            id: '1',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/1/contactGoalTags',
            },
            tag: 'one',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:16-05:00',
            description: '',
            id: '2',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/2/contactGoalTags',
            },
            tag: 'two',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-17T13:41:18-05:00',
            description: '',
            id: '3',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/3/contactGoalTags',
            },
            tag: 'three',
            tagType: 'contact',
          },
          {
            cdate: '2018-08-28T11:54:36-05:00',
            description: '',
            id: '4',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/4/contactGoalTags',
            },
            tag: 'test1',
            tagType: 'template',
          },
          {
            cdate: '2018-08-28T11:54:38-05:00',
            description: '',
            id: '5',
            links: {
              contactGoalTags: 'https://:account.api-us1.com/api/:version/tags/5/contactGoalTags',
            },
            tag: 'DIY_Hobby',
            tagType: 'template',
          },
        ],
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: '5' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 13,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: '5',
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: 11 } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 14,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: 11,
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactTag: { contact: '2', tag: 12 } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactTags',
    },
    httpRes: {
      data: {
        contactTag: {
          cdate: '2017-06-08T16:11:53-05:00',
          contact: '2',
          id: 15,
          links: { contact: '/1/contact', tag: '/1/tag' },
        },
        tag: 12,
      },
      status: 201,
    },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 2, status: '1' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 2, status: '1' } }, status: 200 },
  },
  {
    httpReq: {
      data: { contactList: { contact: '2', list: 3, status: '2' } },
      headers: {
        'Api-Token': 'dummyApiKey',
        'Content-Type': 'application/json',
      },

      method: 'POST',

      url: 'https://active.campaigns.rudder.com/api/3/contactLists',
    },
    httpRes: { data: { contactList: { contact: '2', list: 3, status: '2' } }, status: 200 },
  },
  {
    httpReq: {
      headers: { Accept: 'application/json, text/plain, */*', 'Api-Token': 'dummyApiKey' },

      method: 'GET',

      url: 'https://active.campaigns.rudder.com/api/3/fields?limit=100',
    },
    httpRes: {
      data: {
        fieldOptions: [],
        fieldRels: [],
        fields: [
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Random  description',
            id: '4',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Random',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Likes  description',
            id: '3',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Likes',
            type: 'multivalue',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:43:38-06:00',
            cols: '0',
            defval: null,
            descript: null,
            id: '2',
            isrequired: '0',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/2/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/2/relations',
            },
            options: [],
            ordernum: '2',
            perstag: 'ANOTHER_TEST_TITLE',
            relations: [],
            rows: '0',
            service: '',
            show_in_list: '0',
            title: 'Another Test Title',
            type: '',
            udate: '2018-11-15T21:43:38-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Country  description',
            id: '1',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Country',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
          {
            cdate: '2018-11-15T21:42:40-06:00',
            cols: '2',
            defval: 'Defaut Value',
            descript: 'Office  description',
            id: '0',
            isrequired: '1',
            links: {
              options: 'https://:account.api-us1.com/api/:version/fields/1/options',
              relations: 'https://:account.api-us1.com/api/:version/fields/1/relations',
            },
            options: [],
            ordernum: '3',
            perstag: 'PERSONALIZEDTAG',
            relations: [],
            rows: '2',
            service: 'google',
            show_in_list: '1',
            title: 'Office',
            type: 'textarea',
            udate: '2018-11-15T21:49:52-06:00',
            visible: '1',
          },
        ],
        meta: { total: '4' },
      },
      status: 200,
    },
  },
];
