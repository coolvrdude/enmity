import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import owoify from "owoify-js";

const Owoify: Plugin = {
  name: "owoify",
  commands: [],

  onStart() {
    const owu: Command = {
      id: "owoify-command",
      applicationId: EnmitySectionID,

      name: "owoify",
      displayName: "owoify",

      description: "owo, uwu, uvu, what's this?",
      displayDescription: "owo, uwu, uvu, what's this?",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "text",
          displayName: "text",

          description: "text to send uwu",
          displayDescription: "text to send uwu",
          
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "level",
          displayName: "level",

          description: "how much owo do you want",
          displayDescription: "how much owo do you want",

          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            {
              name: "owo",
              displayName: "owo",
              value: "owo"
            },
            {
              name: "uwu",
              displayName: "uwu",
              value: "uwu"
            },
            {
              name: "uvu",
              displayName: "uvu",
              value: "uvu"
            }
          ]
        }
      ],
    
      execute: function (args, message) {
        const text = args[0].value;
    
        return {
          content: owoify(text, args[1] ? args[1].value : 'owo')
        };
      }
    }

    this.commands.push(owu);
  },

  onStop() {

  }
}

registerPlugin(Owoify);
