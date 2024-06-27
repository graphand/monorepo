"use strict";

module.exports = function () {
  return {
    autoDetect: true,
    name: "@graphand/client",
    testFramework: {
      configFile: "./jest.config.json",
    },
    runMode: "onsave",
  };
};
