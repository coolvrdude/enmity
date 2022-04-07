import { Command, EnmitySectionID, ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType } from "enmity-api/commands";
import { Plugin, registerPlugin } from "enmity-api/plugins";
import { sendReply } from "enmity-api/clyde";

async function evaluate(src: string, isAsync: boolean = false) {
  let result, errored;
  if (isAsync || src.includes("await")) {
    if (src.includes(";") && (!src.endsWith(";") || src.includes("\n") || (src.split(';').length) > 2)) {
      src = `(async () => { ${src} })()`;
    } else {
      src = `(async () => { return ${src} })()`;
    }
  }

  let start = new Date().getTime();
  try {
    result = eval(src);
    if (result instanceof Promise) {
      result = await result;
    }
  } catch(e) {
    result = e;
    errored = true;
  }

  let elapsed = new Date().getTime() - start;
  return [errored, result, elapsed];
}

const EvalPlugin: Plugin = {
  name: "Eval",
  commands: [],

  onStart() {
    const sync_eval_command: Command = {
      id: "sync-eval-command",
      applicationId: EnmitySectionID,

      name: "eval",
      displayName: "eval",

      description: "Evaluates JS",
      displayDescription: "Evaluates JS. DO NOT RUN WHAT YOU DO NOT UNDERSTAND.",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "src",
          displayName: "src",

          description: "code to evaluate",
          displayDescription: "code to evaluate",
          
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    
      execute: async function (args, message) {
        const src = args[0].value;
        const [error, result, elapsed] = await evaluate(src);
        sendReply(message.channel.id, [
          `${error ? "Failed executing" : "Successfully executed"} in ${elapsed}ms`,
          `\`\`\`js\n${result}\n\`\`\``
        ].join('\n'))
      }
    }

    const async_eval_command: Command = {
      id: "async-eval-command",
      applicationId: EnmitySectionID,

      name: "eval async",
      displayName: "eval async",

      description: "Evaluates JS synchronously",
      displayDescription: "Evaluates JS synchronously. DO NOT RUN WHAT YOU DO NOT UNDERSTAND.",
      
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltInText,
      
      options: [
        {
          name: "src",
          displayName: "src",

          description: "code to evaluate",
          displayDescription: "code to evaluate",
          
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    
      execute: async function (args, message) {
        const src = args[0].value;
        const [error, result, elapsed] = await evaluate(src, true);
        sendReply(message.channel.id, [
          `${error ? "Failed executing" : "Successfully executed"} in ${elapsed}ms`,
          `\`\`\`js\n${result}\n\`\`\``
        ].join('\n'))
      }
    }

    this.commands.push(sync_eval_command);
    this.commands.push(async_eval_command);
  },

  onStop() {
    this.comamands = [];
  }
}

registerPlugin(EvalPlugin);
