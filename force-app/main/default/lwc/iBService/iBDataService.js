import initData from "@salesforce/apex/IBLandingPageAuraController.initData";

const getTopics = appType => {
  console.log("===IBService.getTopics===\n Param: " + appType);

  const pm = initData({ appType: appType });
  return pm;
};

export { getTopics };