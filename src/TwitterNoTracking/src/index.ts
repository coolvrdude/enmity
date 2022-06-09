import { Plugin, registerPlugin } from "enmity-api/plugins";
import { getModule } from "enmity-api/module";
import { create } from "enmity-api/patcher";
import { showDialog } from "enmity-api/dialog"

const MessagesModule = getModule(m => m.default?.sendMessage);

const TwitterNoTracking: Plugin = {
  name: "TwitterNoTracking",
  patches: [],

  onStart() {
        // helpers

    function removeParam(key, sourceURL) { // modified from https://stackoverflow.com/a/16941754 
      var baseURL = sourceURL.split("?")[0];
      if (sourceURL.indexOf("?") > 0) {
          var toReturn = baseURL;
          var queryString = sourceURL.split("?")[1];
          var params_arr = queryString.split("&");
          for (var i = params_arr.length - 1; i >= 0; i -= 1) {
              let param = params_arr[i].split("=")[0];
              if (param === key) {
                  params_arr.splice(i, 1);
              }
          }
          if (params_arr.length > 0) {
              toReturn = baseURL + "?" + params_arr.join("&");
          }
          return toReturn;
      } else {
          return sourceURL;
      }
    }
    
    const removeTwitterURLTracking = (message) => {
        // find the URL in the message
        const urlRegex = /(https?:\/\/[^\s]+)/g; // this is really bad
        const urlMatches = message.match(urlRegex); 
        if (urlMatches) { // if there are any URLs in the message
            urlMatches.forEach((url) => {
                if (url.includes("twitter.com")) {
                    var urlStripped = removeParam("t", url);
                    var urlStripped = removeParam("s", urlStripped);
                    message = message.replace(url, urlStripped); // Keeps the message while only modifying the URL
                }
            });
        }
        return message;
    }

      // patcher

      // Create a new patcher
      const MessageTwitterPatcher = create("message-twitter-patcher");
      // Patch the sendMessage function
      MessageTwitterPatcher.before(MessagesModule.default, "sendMessage", (_, args, __) => {
        // channel ID: args[0]
        var orig = args[1]["content"];
        args[1]["content"] = removeTwitterURLTracking(args[1].content);
      });
  },

  onStop() {
    this.patchers = [];
  }
}

registerPlugin(TwitterNoTracking);


