import * as FlexWebChat from "@twilio/flex-webchat-ui";

export default {
  pushTaskToWrapping(token, channel) {
    const { attributes } = channel;

    if (!attributes.taskSid && !attributes.runTimeDomain) {
      throw Error('Could not end chat because the task Sid is not in the channel attributes.');
    }

    return new Promise((resolve, reject) => {
      fetch(`https://${attributes.runTimeDomain}/wrap-task`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: `Token=${token}&taskSid=${attributes.taskSid}&channelSid=${channel.sid}`
      }).then(() => {
        resolve(channel);
      }).catch((e) => {
        reject(e);
      })
    })
  }
}