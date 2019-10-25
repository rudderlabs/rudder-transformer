//Implementation of custom filter for Torpedo
//It will take in a batch and then
//a) Emit 1:1 request for each message with "GA" as integration
//b) Emit 1:1 request for each non-spin message with "AM" as integration
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;
const url = require("url");
const jsonQ = require("jsonq");
const amplitudeJS = require("./v0/AmplitudeTransform.js");
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
const IOS_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";

const IOS_PRESENT_UA = "ios";

require("./util/logUtil");

function start(port) {
  if (!port) {
    port = 9393;
  }

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    //Main server body
    http
      .createServer(function(request, response) {
        var pathname = url.parse(request.url).pathname;

        //Adding logic for a call that will invalidate cache
        //for particular module in order that next require call for
        //that module will reload the same
        if (request.method == "POST") {
          var body = "";
          var respBody = "";

          request.on("data", function(data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            // if (body.length > 1e6)
            //     request.connection.destroy();
            if (body.length > 1e8) {
              response.statusCode = 413;
              response.end();
            }
          });

          request.on("end", async function() {
            try {
              //need to send 400 error for malformed JSON

              response.statusCode = 200;
              var requestJson = JSON.parse(body);
              var jsonQobj = jsonQ(requestJson);

              //Iterate through the messages

              //But first create the message list that will finally hold all messages
              var messageList = [];

              //Also create the map structure where total_payments will be
              // tracked per user
              var userTotalPayments = new Map();

              //Also map structures for keeping user-specific
              //context just for completeness sake. They
              //do not influence processing in any way
              var userContext = new Map();

              //And finally a counter for catching every n-th message
              var messageCounter = 0;

              var batchLength = requestJson.length;
              var GAbatchLengthToSend = Math.ceil(batchLength / 4);
              var GAmessageList = [];

              jsonQobj.find("rl_message").each(function(index, path, value) {
                //Extract the rl_anonymous_id for direct inclusion under
                //rl_message
                var anonymousId = jsonQ(value)
                  .find("rl_anonymous_id")
                  .value()[0];

                //rl_event will be required for populating "ec"
                var eventName = jsonQ(value)
                  .find("rl_event")
                  .value()[0];

                // find user_id from rl_user_properties
                var userId;
                jsonQ(value)
                  .find("rl_user_properties")
                  .each(function(index, path, user_props) {
                    userId = user_props["user_id"];
                  });

                //Construct single message
                var messageObj = new Object();

                //GA message is as-is full payload
                messageObj["rl_message"] = Object.assign({}, value);

                //Set rl_integrations to only GA
                //messageObj['rl_message']['rl_integrations'] = 'GA';
                messageObj["rl_message"]["rl_integrations"] = {
                  All: false,
                  GA: true
                };

                //Add rl_anonymous_id same as user_id if present, else anonymous_id
                messageObj["rl_message"]["rl_anonymous_id"] = userId
                  ? userId
                  : anonymousId;
                messageObj["rl_message"]["rl_context"]["rl_traits"][
                  "rl_anonymous_id"
                ] = userId ? userId : anonymousId;

                //set category to rl_event value

                //Temporary fix for non-existent rl_properties
                if (!messageObj["rl_message"]["rl_properties"]) {
                  messageObj["rl_message"]["rl_properties"] = {};
                }
                messageObj["rl_message"]["rl_properties"][
                  "category"
                ] = eventName;

                // fix UA, as Torpedo ios sdk is using older version
                var userAgent =
                  messageObj["rl_message"]["rl_context"]["rl_user_agent"];
                messageObj["rl_message"]["rl_context"][
                  "rl_user_agent"
                ] = userAgent.includes(IOS_PRESENT_UA)
                  ? IOS_USER_AGENT
                  : userAgent;

                console.log(messageObj);

                //Add the GA message
                GAmessageList.push(messageObj);

                //Send only unfiltered events to Amplitude

                if (!(eventName && filterEventNames.includes(eventName))) {
                  //non-spin event
                  //Repeat construction
                  var messageObjAM = new Object();

                  //Amplitude message is as-is full payload for non-spin message
                  messageObjAM["rl_message"] = Object.assign({}, value);

                  //Set rl_integrations to only Amplitude
                  messageObjAM["rl_message"]["rl_integrations"] = {
                    All: false,
                    AM: true
                  };

                  //Add rl_anonymous_id
                  messageObjAM["rl_message"]["rl_anonymous_id"] = anonymousId;

                  //Add the AM message
                  messageList.push(messageObjAM);
                }
              });

              const shuffledList = GAmessageList.sort(
                () => 0.5 - Math.random()
              );
              const listToSend = shuffledList.splice(0, GAbatchLengthToSend);
              messageList.push(...listToSend);

              //Construct overall payload
              var responseObj = {};
              responseObj["sent_at"] = String(jsonQobj.find("sent_at").value());
              responseObj["batch"] = messageList;

              //response.end(JSON.stringify(responseObj));
              //console.log(JSON.stringify(messageList))
              response.end(JSON.stringify(messageList));
              //response.end(body);
            } catch (se) {
              response.statusCode = 500; //500 for other errors
              response.statusMessage = se.message;
              console.log(se.stack);

              response.end();
            }
          });
        }
      })
      .listen(port);

    console.log(`Worker ${process.pid} started`);
  }

  console.log("userTransformer: started");
}

start(9292);
