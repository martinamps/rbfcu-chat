// Uncomment to add polyfills to run on IE (e.g. IE11)
// import 'react-app-polyfill/ie9';
// import 'ie-array-find-polyfill';
// import 'array-findindex-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import App from './App';

const brandColor0 = "#1976d2";
const brandColor1 = "#233659";
const brandTextColor = "#ffffff";

const personalizedColors = {
	darkBlueBackground: "#3C425C",
	whiteText: "#FFFFFF",
	entryPointBackground: "#3C425C",
	lighterBackground: "#ecedf1",
	primaryButtonBackground: "#1976d2",
	primaryButtonColor: "#FFFFFF",
	secondaryButtonBackground: "#6e7180",
	secondaryButtonColor: "#FFFFFF",
};

const brandMessageBubbleColors = bgColor => ({
	Bubble: {
		background: bgColor,
		color: brandTextColor,
	},
	Avatar: {
		background: bgColor,
		color: brandTextColor,
	},
	Header: {
		color: brandTextColor,
	},
});

const brandedColors = {
	Chat: {
		MessageListItem: {
			FromOthers: brandMessageBubbleColors(brandColor1),
			FromMe: brandMessageBubbleColors(brandColor0),
		},
		MessageInput: {
			Button: {
				background: brandColor0,
				color: brandTextColor,
			},
		},
		MessageCanvasTray: {
			Container: {
				background: personalizedColors.darkBlueBackground,
				color: personalizedColors.whiteText,
			},
		},
	},
	MainHeader: {
		Container: {
			background: personalizedColors.darkBlueBackground,
			color: personalizedColors.whiteText,
		},
		Logo: {
			fill: brandTextColor,
		},
	},
	EntryPoint: {
		Container: {
			background: personalizedColors.entryPointBackground,
			color: personalizedColors.whiteText,
		},
	},
};

const appConfig = {
  startEngagementOnInit: true,
  colorTheme: {
    overrides: brandedColors,
  },
  componentProps: {
    MainHeader: {
      imageUrl: "assets/images/icons/rbfcu-spin-logo-white.svg",
    },
    MessagingCanvas: {
      showTrayOnInactive: false,
      showReadStatus: false,
      showWelcomeMessage: false,
    },
    MessageCanvasTray: {
      showButton: false,
    },
    EntryPoint: {
      tagline: "ongoing chat",
      isEntryPointExpanded: true,
      bottom: "5%",
      right: "3%",
    },
    MessageListItem: {
      useFriendlyName: false,
    },
    MainContainer: {
      height: "70%",
      width: "315px;",
      bottom: "8%",
      right: "2%",
    }
  }
};

let isLoaded = false;
let container;

window.loadFlexWebchat = function(overrides, onEndCallback) {
  const config = Object.assign(appConfig, overrides);
  container = config.container;
  if (isLoaded) {
    throw new Error('Flex Webchat already initialized');
  }

  return new Promise((resolve, reject) => {
    isLoaded = true;
    ReactDOM.render(
      <App configuration={config} onEndCallback={onEndCallback} resolve={resolve} reject={reject} />,
      document.getElementById(container)
    );
  });
}

function checkLoaded()  {
  if (!isLoaded) {
    throw new Error('Flex is not initialized');
  }
}

window.toggleFlexWebchat = function()  {
  checkLoaded();
  window.Twilio.FlexWebChat.Actions.invokeAction('ToggleChatVisibility')
}

function getChannel() {
  checkLoaded();

  try {
    let chatClient = window.Twilio.FlexWebChat.manager.chatClient;
    let channelSid = chatClient.channels.channels.values().next().value.sid;
    return window.Twilio.FlexWebChat.manager.chatClient.getChannelBySid(channelSid);
  } catch (e) {
    return Promise.reject(new Error('no chat started'));
  }
}

window.chatHasMessages = function() {
  checkLoaded();
  return getChannel().then(c => {
    return c.messagesEntity.messagesByIndex.size > 0;
  }).catch(() => false);
}

window.sendQuestion = function(question) {
  checkLoaded();
  return getChannel()
    .then(c =>  {
      c.sendMessage(question);
    }).catch((e) => { console.log('not sending message', e); return false; });
}