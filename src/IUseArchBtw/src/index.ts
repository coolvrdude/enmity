import { Command, EnmitySectionID, registerCommands, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
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
      
      options: [{
        name: "text",
        displayName: "text",

        description: "Text to send",
        displayDescription: "Text to send",
        
        type: ApplicationCommandOptionType.String,
        required: true
      }],
    
      execute: function (args, message) {
        const text = args[0].value;
    
        return {
          content: `${text} i use arch btw`
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
