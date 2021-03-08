export const INITIAL_TABS_LENGTH = 3;
export const MAX_TABS = 10;
export const LEFT = "LEFT";
export const RIGHT = "RIGHT";

export const getTab = (i) => ({
  label: `Tab ${i + 1}`,
  id: `tab${i + 1}`,
});

export const getInitalTabList = (count) =>
  Array.from({ length: count }, (k, v) => k).map((val, i) => getTab(i));

export const getInitalTabContent = (tabs) => {
  let tabContents = {};
  tabs.forEach((tab) => {
    tabContents[tab.id] = `${tab.label} Content`;
  });
  return tabContents;
};