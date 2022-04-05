import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { generateEmojipasta } from "./emojipasta";

const Emojipasta: Plugin = {
  name: "Emojipasta",
  commands: [],

  onStart() {
    const emojipasta: Command = {
      id: "emojipasta-command",
      applicationId: EnmitySectionID,

      name: "emojipasta",
      displayName: "emojipasta",

      description: "Generates an emojipasta from ▶👉 the 👏👘 given 👈👤 text. 😱",
      displayDescription: "Generates an emojipasta from ▶👉 the 👏👘 given 👈👤 text. 😱",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "text",
          displayName: "text",

          description: "The 😫😗 text to 👁😖 emojify",
          displayDescription: "The 😫😗 text to 👁😖 emojify",
          
          type: ApplicationCommandOptionType.String,
          required: true
        },
      ],
    
      execute: function (args, message) {
        const text = args[0].value;
        return {
          content: generateEmojipasta(text)
        };
      }
    }

    this.commands.push(emojipasta);
  },

  onStop() {
    this.commands = [];
  }
}

registerPlugin(Emojipasta);
