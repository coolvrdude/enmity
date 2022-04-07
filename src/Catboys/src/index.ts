import { sendReply } from "enmity-api/clyde";
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command, EnmitySectionID } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { Image } from "enmity-api/react";
import { get } from "enmity-api/rest";

const catboys_img_types = [
  'img',
  'baka'
]

async function getImageSize(file: string): Promise<any> {
  return new Promise(
    (resolve, reject) => {
      Image.getSize(file, (width: number, height: number) => {
        resolve({ width, height });
      }, 
      (error) => {
        reject(error);
      });
    }
  );
}

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
          if (whisper) {
            const { width, height } = await getImageSize(resp.body['url']);
            let embed = {
              type: 'rich',
              title: text === "img" ? 'random image' : `random ${text} image`,
              image: {
                proxy_url: `https://external-content.duckduckgo.com/iu/?u=${resp.body['url']}`,
                url: resp.body['url'],
                width: width,
                height: height
              },
              footer: {
                text: "catboys.com"
              },
              color: '0x45f5f5'
            }
            if (text === "img" && resp.body['artist'] !== "unknown") {
              Object.assign(embed, {
                fields: [
                  {
                    inline: true,
                    name: "Artist",
                    value: `[${resp.body['artist']}](${resp.body['artist_url']})`
                  } 
                ]
              });
            }
            
            const component = {
              type: 1,
              components: [{
                type: 2,
                style: 5,
                label: "View image",
                url: resp.body['url']
              }]
            }
            
            sendReply(
              message.channel.id, 
              {
                embeds: [embed],
                components: [component]
              }, 
              "catboys.com", 
              "https://github.com/Catboys-Dev.png"
            );
          } else {
            let reply: string;
            if (text === "img" && resp.body['artist'] !== "unknown") {
              reply = [
                `Artist: <${resp.body['artist']}> (<${resp.body['artist_url']}>)`,
                `Sauce: <${resp.body['source_url']}>`,
                resp.body['url']
              ].join("\n")
            }
            else {
              reply = resp.body['url']
            }
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
