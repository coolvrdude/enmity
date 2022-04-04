import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";

const IUseArchBtw: Plugin = {
  name: "IUseArchBtw",
  commands: [],

  onStart() {
    const btw: Command = {
      id: "i-use-arch-btw-command",
      applicationId: EnmitySectionID,

      name: "btw",
      displayName: "btw",

      description: "Appends \"i use arch btw\" to the end of your message.",
      displayDescription: "Appends \"i use arch btw\" to the end of your message.",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "text",
          displayName: "text",

          description: "Text to send btw",
          displayDescription: "Text to send btw",
          
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "suffix",
          displayName: "suffix",

          description: "Text to append to the end of your message",
          displayDescription: "Text to append to the end of your message",

          type: ApplicationCommandOptionType.String,
          required: false
        }
      ],
    
      execute: function (args, message) {
        const text = args[0].value;
        const append = args[1]?.value ?? "i use arch btw";
    
        return {
          content: `${text} ${append}`
        };
      }
    }

    this.commands.push(btw);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(IUseArchBtw);
