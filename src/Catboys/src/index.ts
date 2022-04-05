import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { sendReply } from "enmity-api/clyde";
import { get } from "enmity-api/rest";

const catboys_img_types = [
  'img',
  'baka'
]
const CatboysPlugin: Plugin = {
  name: "Catboys",
  commands: [],

  onStart() {
    const catboys_command: Command = {
      id: "catboys-command",
      applicationId: EnmitySectionID,

      name: "catboys",
      displayName: "catboys",

      description: "Sends an image from the catboys.com API.",
      displayDescription: "Sends an image from the catboys.com API.",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "type",
          displayName: "type",

          description: "Image type",
          displayDescription: "Image type",
          
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: catboys_img_types.map(x => ({name: x, displayName: x, value: x}))
        },
        {
          name: "whisper",
          displayName: "whisper",

          description: "Whisper the URL instead of sending it to chat",
          displayDescription: "Whisper the URL instead of sending it to chat",

          type: ApplicationCommandOptionType.Boolean,
          required: false
        }
      ],
    
      execute: async function (args, message) {
        const text = args[0].value;
        const whisper = args[1]?.value ?? true
        const resp = await get(`https://api.catboys.com/${text}`);
        if (resp.ok && resp.body['error'] === "none") {
          const channel = message.channel;
          let reply: string = "";
          if (text === "img") {
            reply = [
              `Artist: <${resp.body['artist']}> (<${resp.body['artist_url']}>)`,
              `Sauce: <${resp.body['source_url']}>`,
              resp.body['url']
            ].join("\n")
          }
          else {
            reply = resp.body['url']
          }
          if (whisper) {
            sendReply(channel.id, reply);
          }
          else {
            return {
              content: reply
            };
          }
        }
        else {
          const channel = message.channel;
          sendReply(channel.id, `An error happened making a request to https://api.catboys.com/${text}`)
        }
      }
    }

    this.commands.push(catboys_command);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(CatboysPlugin);
