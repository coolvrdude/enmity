import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";

const RawMessagePlugin: Plugin = {
  name: "RawMessage",
  commands: [],

  onStart() {
    const raw_message_command: Command = {
      id: "raw-message-command",
      applicationId: EnmitySectionID,

      name: "raw",
      displayName: "raw",

      description: "Sends a raw message with Markdown escaped.",
      displayDescription: "Sends a raw message with Markdown escaped.",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "text",
          displayName: "text",

          description: "Message to send raw",
          displayDescription: "Message to send raw",
          
          type: ApplicationCommandOptionType.String,
          required: true
        },
      ],
    
      execute: function (args, message) {
        const text = args[0].value;
        return {
          content: text.replace(/(\_|\*|\~|\`|\||\\|\<|\>|\:|\!)/g, "\\$1").replace(/@(everyone|here|[!&]?[0-9]{17,21})/g, "@\u200b$1")
        };
      }
    }

    this.commands.push(raw_message_command);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(RawMessagePlugin);
