import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { sendReply } from "enmity-api/clyde";
import { get } from "enmity-api/rest";

const nekos_life_img_types = ['solog', 'smug', 'feet', 'smallboobs', 'lewdkemo', 'woof', 'gasm', 'solo', '8ball', 'goose', 'cuddle', 'avatar', 'cum', 'slap', 'les', 'v3', 'erokemo', 'bj', 'pwankg', 'nekoapi_v3.1', 'ero', 'hololewd', 'pat', 'gecg', 'holo', 'poke', 'feed', 'fox_girl', 'tits', 'nsfw_neko_gif', 'eroyuri', 'holoero', 'pussy', 'Random_hentai_gif', 'lizard', 'yuri', 'keta', 'neko', 'hentai', 'feetg', 'eron', 'erok', 'baka', 'kemonomimi', 'hug', 'cum_jpg', 'nsfw_avatar', 'erofeet', 'meow', 'kiss', 'wallpaper', 'tickle', 'blowjob', 'spank', 'kuni', 'classic', 'waifu', 'femdom', 'boobs', 'trap', 'lewd', 'pussy_jpg', 'anal', 'futanari', 'ngif', 'lewdk']

const CatgirlsPlugin: Plugin = {
  name: "Catgirls",
  commands: [],

  onStart() {
    const catgirls_command: Command = {
      id: "catgirls-command",
      applicationId: EnmitySectionID,

      name: "nekos",
      displayName: "nekos",

      description: "Sends an image from the nekos.life API.",
      displayDescription: "Sends an image from the nekos.life API.",
      
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
          choices: nekos_life_img_types.map(x => ({name: x, displayName: x, value: x}))
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
        const resp = await get(`https://nekos.life/api/v2/img/${text}`);
        if (resp.ok) {
          const channel = message.channel;
          if (whisper) {
            sendReply(channel.id, resp.body['url']);
          }
          else {
            return {
              content: resp.body['url']
            };
          }
        }
        else {
          const channel = message.channel;
          sendReply(channel.id, `An error happened making a request to https://nekos.life/api/v2/img/${text}`)
        }
      }
    }

    this.commands.push(catgirls_command);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(CatgirlsPlugin);
