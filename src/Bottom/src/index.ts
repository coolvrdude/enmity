import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { sendReply } from "enmity-api/clyde";
import { encode, decode } from "./bottomify";


const BottomPlugin: Plugin = {
  name: "Bottom",
  commands: [],

  onStart() {
    const bottom_command: Command = {
      id: "bottom-command",
      applicationId: EnmitySectionID,

      name: "bottom bottomify",
      displayName: "bottom bottomify",

      description: "Translate and send text as bottom 🥺",
      displayDescription: "Translate and send text as bottom 🥺",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "text",
          displayName: "text",

          description: "text to send as bottom",
          displayDescription: "text to send as bottom",
          
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    
      execute: function (args, message) {
        const text = args[0].value;
    
        return {
          content: encode(text)
        };
      }
    }
    
    const regress_command: Command = {
      id: "regress-command",
      applicationId: EnmitySectionID,

      name: "bottom regress",
      displayName: "bottom regress",

      description: "Translate from bottom 🥺 to text",
      displayDescription: "Translate from bottom 🥺 to text",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "text",
          displayName: "text",

          description: "text to translate from bottom",
          displayDescription: "text to translate from bottom",
          
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    
      execute: async function (args, message) {
        const text = args[0].value;
        const channel = message.channel;
        sendReply(channel.id, decode(text));
      }
    }

    this.commands.push(bottom_command);
    this.commands.push(regress_command);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(BottomPlugin);
