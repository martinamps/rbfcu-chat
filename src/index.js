// Uncomment to add polyfills to run on IE (e.g. IE11)
// import 'react-app-polyfill/ie9';
// import 'ie-array-find-polyfill';
// import 'array-findindex-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';
import App from './App';
import * as FlexWebChat from "@twilio/flex-webchat-ui";

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
  startEngagementOnInit: false,
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
      showWelcomeMessage: true,
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
let rootContainer;
let chatContainer;
const containerId = 'flex-webchat-container';

window.loadFlexWebchat = function(overrides) {
  const config = Object.assign(appConfig, overrides);

  if (isLoaded) {
    return Promise.resolve();
  }

  rootContainer = document.getElementById(config.container);
  chatContainer = document.createElement('div');
  chatContainer.id = containerId;

  rootContainer.appendChild(chatContainer);

  return new Promise((resolve, reject) => {
    isLoaded = true;
    ReactDOM.render(
      <App configuration={config} resolve={resolve} reject={reject} />,
      document.getElementById(containerId)
    );
  });
}

function checkLoaded()  {
  if (!isLoaded) {
    throw new Error('Flex is not initialized');
  }
}

window.toggleFlexEntryPoint = function() {
  checkLoaded();
  if (rootContainer.style.display === 'none') {
    rootContainer.style.display = '';
  } else {
    rootContainer.style.display = 'none';
  }
}

window.showFlex = function() {
  if (rootContainer) {
    rootContainer.style.display = '';
  }
}

window.hideFlex = function() {
  if (rootContainer) {
    rootContainer.style.display = 'none';
  }
}

window.toggleFlexWebchat = function()  {
  checkLoaded();
  FlexWebChat.Actions.invokeAction('ToggleChatVisibility');
}

window.restartEngagement = function() {
  checkLoaded();
  FlexWebChat.Actions.invokeAction('RestartEngagement');
}