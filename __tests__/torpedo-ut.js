const ivm = require("isolated-vm");
const get = require("get-value");

//local test, not modifying the original test cases.
//commiting this for reference
async function runUserTransform() {
  const codeGA = ` function transform(events) {
    const IOS_USER_AGENT =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
  
    const IOS_PRESENT_UA = "ios";
    const destination = events[0].destination;

    let GAbatchLengthToSend = Math.ceil(events.length / 4);

    events.map(event => {
        let anonymousId = get(event.message, "anonymousId")
        if(!anonymousId) {
            anonymousId = get(event.message, "context.traits.anonymousId")
        }

        let eventName = get(event.message, "event")

        let userId
        userId = get(event.message, "userProperties.user_id")

        event.message.anonymousId = userId || anonymousId
        event.message.context.traits.anonymousId = userId || anonymousId
        event.message.userId =  userId || anonymousId

        if(!event.message.properties) {
            event.message.properties = {}
        }

        event.message.properties.category = eventName

        let userAgent = get(event.message, "context.userAgent")
        event.message.context.userAgent = userAgent.includes(IOS_PRESENT_UA)
        ? IOS_USER_AGENT
        : userAgent;

        //log(JSON.stringify(event))
        return event

    })

    const shuffledList = events.sort(
        () => 0.5 - Math.random()
      );
      const listToSend = shuffledList.splice(0, GAbatchLengthToSend);

      //log(JSON.stringify(listToSend))

      return JSON.stringify(listToSend);
    
  } `;

  const codeAM = `
  function transform(events) {

    const filterEventNames = [
        "achievement_claim_event",
        "auto_spin_selection",
        "battle_disconnected",
        "battle_end",
        "battle_match_making",
        "battle_player_spins_ended",
        "battle_reconnected",
        "battle_send_emote",
        "battle_spin_result",
        "battle_view_opponent_profile",
        "buy_product_click",
        "claim_tournament_reward",
        "close_high_roller_room",
        "daily_rewards_claim",
        "deep_link_rewarded",
        "feature_game_selection",
        "game_load_time",
        "hyper_bonus_cancel",
        "hyper_bonus_click",
        "hyper_bonus_purchase",
        "inbox_message_click",
        "lobby_fps",
        "low_coin_promo_popup",
        "not_enough_credit",
        "offer_buy_click",
        "offer_dismiss_click",
        "offer_displayed",
        "open_daily_rewards",
        "open_high_roller_room",
        "open_leaderboard",
        "open_loyalty_rewards",
        "open_tournaments",
        "player_home_load_time",
        "player_level_up",
        "push_notification_click",
        "push_notification_received",
        "questClaim",
        "questItemClaim",
        "questTimeExpired",
        "quest_button_click",
        "rate_us_popup_click_later",
        "rate_us_popup_shown",
        "server_battle_result",
        "settings_view_closed",
        "spin_result",
        "store_open",
        "unverified_revenue"
      ];

    const filteredEvents = events.filter(event => {
      const eventName = get(event.message, "event")
      return !(eventName && filterEventNames.includes(eventName))
    });

    filteredEvents.map(event => {
        let anonymousId = get(event.message, "anonymousId")
        if(!anonymousId) {
            anonymousId = get(event.message, "context.traits.anonymousId")
        }

        let eventName = get(event.message, "event")

        let userId
        userId = get(event.message, "userProperties.user_id")

        if(!userId) {
            userId = get(event.message, "userId")
        }

        event.message.anonymousId = userId || anonymousId
        event.message.context.traits.anonymousId = userId || anonymousId
        event.message.userId =  userId || anonymousId

        let platform
        platform = get(event.message, "context.library.name")

        platform = platform.indexOf("android") > 0 ? "Android" : "iOS"

        event.message.context.platform = platform

        //log(JSON.stringify(event))

        return event
    })

    //log(JSON.stringify(filteredEvents))

    return JSON.stringify(filteredEvents);
  }  
  `;
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = await isolate.createContext();

  const jail = context.global;
  jail.setSync("global", jail.derefInto());

  jail.setSync("_ivm", ivm);

  jail.setSync(
    "_get",
    new ivm.Reference(function(...args) {
      return get(...args);
    })
  );

  jail.setSync(
    "_log",
    new ivm.Reference(function(...args) {
      console.log(...args);
    })
  );

  let bootstrap = isolate.compileScriptSync(
    "new " +
      function() {
        let ivm = _ivm;
        delete _ivm;

        let log = _log;
        delete _log;
        global.log = function(...args) {
          log.applyIgnored(
            undefined,
            args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          );
        };

        let get = _get;
        delete _get;
        global.get = function(...args) {
          const val = get.applySync(
            undefined,
            args.map(arg => new ivm.ExternalCopy(arg).copyInto())
          );
          return val;
        };
      }
  );

  bootstrap.runSync(context);

  const customScript = await isolate.compileScript(codeAM + "");
  customScript.run(context).catch(err => console.log(err));

  const fnRef = await context.global.get("transform");
  const events = [
    {
      message: {
        messageId: "1572589334-cdf42191-22a5-47fe-8839-311c3c5d988a",
        anonymousId: "0e823111-48cf-4196-b77d-48d3ee3f048a",
        channel: "mobile",
        event: "test_event_unity_track",
        context: {
          screen: {
            density: 2,
            width: 896,
            height: 414
          },
          os: {
            name: "iOS",
            version: "12.4"
          },
          locale: "en-IN",
          app: {
            version: "1",
            namespace: "com.rudderlabs.ios.RudderSDKUnityTest",
            name: "RudderSDKUnityTest",
            build: "1.0"
          },
          traits: {
            anonymousId: "0e823111-48cf-4196-b77d-48d3ee3f048a"
          },
          library: {
            name: "rudder-ios-library",
            version: "1.0"
          },
          device: {
            id: "0e823111-48cf-4196-b77d-48d3ee3f048a",
            manufacturer: "Apple",
            model: "iPhone",
            name: "Arnabâs iPhone"
          },
          userAgent: "ios",
          timezone: "Asia/Kolkata",
          network: {
            bluetooth: false,
            wifi: true,
            carrier: "unavailable",
            cellular: false
          }
        },
        originalTimestamp: "2019-11-01T06:22:14.577Z",
        properties: {
          test_key_1: "test_value_1",
          test_key_2: "test_value_2"
        },
        type: "track",
        userProperties: {
          test_user_key_1: "test_user_value_1",
          test_user_key_2: "test_user_value_2"
        },
        integrations: {
          All: true
        },
        sentAt: "2019-11-01T06:22:24.638Z"
      }
    }
  ];
  const sharedMessagesList = new ivm.ExternalCopy(events).copyInto({
    transferIn: true
  });
  const res = await fnRef.apply(context.global.derefInto(), [
    sharedMessagesList
  ]);
  isolate.dispose();
  console.log(res);
  return res;
}

/* runUserTransform().then(() => {
  console.log("completed");
}); */

runUserTransform();

//console.log(get({ prop: "val1" }, "prop"));
