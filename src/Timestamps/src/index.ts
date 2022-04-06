import { Plugin, registerPlugin } from "enmity-api/plugins";
import { getModule } from "enmity-api/module";
import { create } from "enmity-api/patcher";

const MessagesModule = getModule(m => m.default?.sendMessage)
const UploadsModule = getModule(m => m.default?.uploadLocalFiles)

// https://github.com/SpoonMcForky/replace-timestamps-pc/blob/main/index.js#L15-L20
function getUnixTimestamp(time: string): string {
  const date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/\d?\d:\d\d/, time);
  const then = Math.round((new Date(date)).getTime() / 1000);
  if (isNaN(then)) return time;
  return `<t:${then}:t>`; //To change the time format, refer to https://github.com/discord/discord-api-docs/blob/master/docs/Reference.md#timestamp-styles
}

const TimestampsPlugin: Plugin = {
  name: "Timestamps",
  patches: [],

  onStart() {
    const MessageTimestampPatcher = create("message-timestamp-patcher");
    MessageTimestampPatcher.before(MessagesModule.default, "sendMessage", (_, args, __) => {
      // channel ID: args[0]
      if (args[1]["content"].search(/(?<!\d)\d{1,2}:\d{2}(?!\d)/) !== -1) {
        args[1]["content"] =  args[1].content.replace(/\d?\d:\d\d/g, (x: string) => getUnixTimestamp(x));
      }
    });

    const UploadTimestampPatcher = create("upload-timestamp-patcher");
    UploadTimestampPatcher.before(UploadsModule.default, "uploadLocalFiles", (_, args, __) => {
      // channel ID: args[0]["id"]
      if (args[3]["content"].search(/(?<!\d)\d{1,2}:\d{2}(?!\d)/) !== -1) {
        args[3]["content"] =  args[3].content.replace(/\d?\d:\d\d/g, (x: string) => getUnixTimestamp(x));
      }
    });
  },

  onStop() {
    this.patches = [];
  }
}

registerPlugin(TimestampsPlugin);
