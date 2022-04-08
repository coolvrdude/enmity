import { sendReply } from "enmity-api/clyde";
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command, EnmitySectionID } from "enmity-api/commands";
import { getModule } from "enmity-api/module";
import { create } from "enmity-api/patcher";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { post } from "enmity-api/rest";
import { getSetting, setSetting } from "enmity-api/settings";

const MessagesModule = getModule(m => m.default?.sendMessage)
const UploadsModule = getModule(m => m.default?.uploadLocalFiles)
const MusicRegex = new RegExp("(https?://(?:open.spotify.com/track/[A-Za-z0-9]+|music.apple.com/[[a-zA-Z][a-zA-Z]]?/album/[a-zA-Z\\d%\\(\\)-]+/[\\d]{1,10}\\?i=[\\d]{1,15}|soundcloud.com/\\S+|listen.tidal.com/track/\\d+))", "gi")

interface SongwhipQueryAttempt {
  success: boolean,
  text: string,
}

async function getSongwhipURL(musicURL: string): Promise<SongwhipQueryAttempt> {
  const resp = await post({
    url: "https://songwhip.com",
    body: {
      url: musicURL
    }
  })
  return {
    success: resp.ok,
    text: resp.ok ? resp.body['url'] : musicURL
  }
}

const SongwhipPlugin: Plugin = {
  name: "Songwhip",
  commands: [],
  patches: [],

  onStart() {
    const MessageSongwhipPatcher = create("message-songwhip-patcher");
    MessageSongwhipPatcher.instead(MessagesModule.default, "sendMessage", (_, args, res) => {
      // channel ID: args[0]
      const setting: boolean = getSetting("me.beerpsi.songwhip-autoconvert") === "true"
      let message = args[1]["content"]
      if (message.search(MusicRegex) !== -1 && setting) {
        const matchedURLs = message.match(MusicRegex) 
        const promises = [];
        for (let i in matchedURLs) {
          promises.push(getSongwhipURL(matchedURLs[i]));
        }
        Promise.all(promises).then((values) => {
          for (let i in values) {
            message = message.replace(matchedURLs[i], values[i].text)
          }
          args[1]["content"] = message
          res(...args)
        })
      } else {
        res(...args)
      }
    });

    const UploadSongwhipPatcher = create("upload-songwhip-patcher");
    UploadSongwhipPatcher.before(UploadsModule.default, "uploadLocalFiles", (_, args, res) => {
      // channel ID: args[0]["id"]
      const setting: boolean = getSetting("me.beerpsi.songwhip-autoconvert") === "true"
      let message = args[3]["content"]
      if (message.search(MusicRegex) !== -1 && setting) {
        const matchedURLs = message.match(MusicRegex) 
        const promises = [];
        for (let i in matchedURLs) {
          promises.push(getSongwhipURL(matchedURLs[i]));
        }
        Promise.all(promises).then((values) => {
          for (let i in values) {
            message = message.replace(matchedURLs[i], values[i].text)
          }
          args[3]["content"] = message
          res(...args)
        })
      } else {
        res(...args)
      }
    });
    
    const songwhip_command: Command = {
      id: "songwhip-command",
      applicationId: EnmitySectionID,

      name: "songwhip",
      displayName: "songwhip",

      description: "Sends a shareable link of your favorite song!",
      displayDescription: "Sends a shareable link of your favorite song!",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "url",
          displayName: "url",

          description: "Share URL of song (Spotify, Apple Music, SoundCloud, Tidal)",
          displayDescription: "Share URL of song (Spotify, Apple Music, SoundCloud, Tidal)",
          
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    
      execute: async function (args, message): Promise<any> {
        let text: string = args[0].value;
        if (text.search(MusicRegex) !== -1) {
          let success: boolean = true;
          const matchedURLs: string[] = text.match(MusicRegex);
          for (let i in matchedURLs) {
            const attempt = await getSongwhipURL(matchedURLs[i]);
            success = attempt.success;
            if (attempt.success) {
              text = text.replace(matchedURLs[i], attempt.text)
            }
          }
          if (!success) {
            sendReply(message.channel.id, "One or more queries to Songwhip failed.", "Songwhip")
          }
          return {
            content: text
          };
        } else {
          sendReply(message.channel.id, "Could not find a valid URL in input.", "Songwhip")
        }
      }
    };
    
    const songwhip_toggle_command: Command = {
      id: "songwhip-toggle-command",
      applicationId: EnmitySectionID,

      name: "songwhip toggle",
      displayName: "songwhip toggle",

      description: "Toggles conversion of music links to Songwhip links.",
      displayDescription: "Toggles conversion of music links to Songwhip links.",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
    
      execute: function (_, message) {
        const setting: boolean = getSetting("me.beerpsi.songwhip-autoconvert") === "true"
        setSetting({
          "me.beerpsi.songwhip-autoconvert": String(!setting)
        });
        sendReply(message.channel.id, `Songwhip auto-conversion has been ${!setting ? "enabled": "disabled"}`, "Songwhip")
      }
    };
    
    this.commands.push(songwhip_command);
    this.commands.push(songwhip_toggle_command);
  },

  onStop() {
    this.commands = [];
    this.patches = [];
  }
}

registerPlugin(SongwhipPlugin);
