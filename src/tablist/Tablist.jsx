import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import cx from "classnames";
import { toast } from "react-toastify";

import TabItem from "./TabItem";
import {
  INITIAL_TABS_LENGTH,
  MAX_TABS,
  LEFT,
  RIGHT,
  getTab,
  getInitalTabList,
  getInitalTabContent,
} from "./helpers";

import "./tablist.scss";

export default function Tablist() {
  const [tabList, setTabList] = useState(getInitalTabList(INITIAL_TABS_LENGTH));
  const [tabContents, setTabContents] = useState(getInitalTabContent(tabList));
  const [selectedTab, setSelectedTab] = useState(tabList[0].id);
  const [leftDisabled, setLeftDisabled] = useState(true);
  const [rightDisabled, setRightDisabled] = useState(true);

  const tabListScroller = useRef(null);

  useEffect(() => {
    checkChevronActive();
  }, [tabList]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    let updatedTabList = [...tabList];

    const [removed] = updatedTabList.splice(startIndex, 1);
    updatedTabList.splice(endIndex, 0, removed);

    setTabList(updatedTabList);
  };

  const addTab = () => {
    const tabListLength = tabList.length;

    if (tabListLength === MAX_TABS) {
      toast.error(`Cannot add more than ${MAX_TABS} tabs`);
      return;
    }

    const newTab = getNewTab(tabListLength);
    const newTabContent = { [newTab.id]: `${newTab.label} Content` };
    const updatedTabList = [...tabList, newTab];

    setTabList(updatedTabList);
    setTabContents({ ...tabContents, ...newTabContent });
  };

  const getNewTab = (length) => {
    if (length === MAX_TABS - 1) length = 0;
    let newTab = getTab(length);

    while (tabList.findIndex((tab) => tab.id === newTab.id) !== -1) {
      if (length < MAX_TABS) length++;
      if (length === 10) length = 0;
      newTab = getTab(length);
    }
    return newTab;
  };

  const deleteTab = (e, tabId, label) => {
    e.stopPropagation();

    const tabListLength = tabList.length;
    if (tabListLength === 1) {
      toast.error("Cannot delete all the tabs");
      return;
    }

    if (selectedTab === tabId) {
      let index = tabList.findIndex((tab) => tab.id === tabId);
      if (index > 0) setSelectedTab(tabList[index - 1].id);
      else setSelectedTab(tabList[index + 1].id);
    }

    const updatedTabList = tabList.filter((tab) => tab.id !== tabId);
    const updatedTabContents = { ...tabContents };
    delete updatedTabContents[tabId];

    setTabList(updatedTabList);
    setTabContents(updatedTabContents);
    toast.success(`${label} has been deleted`);
  };

  const checkChevronActive = () => {
    let isRightDisbbaled =
      Math.floor(
        tabListScroller.current.scrollWidth - tabListScroller.current.scrollLeft
      ) <= tabListScroller.current.offsetWidth;

    setLeftDisabled(tabListScroller.current.scrollLeft === 0);
    setRightDisabled(isRightDisbbaled);
  };

  const onChevronClick = (direction) => {
    const tabwidth = tabListScroller.current.clientWidth / 5;
    const scrollLeft = tabListScroller.current.scrollLeft;
    switch (direction) {
      case LEFT:
        if (!leftDisabled)
          tabListScroller.current.scrollTo({
            top: 0,
            left: scrollLeft - tabwidth,
            behavior: "smooth",
          });
        break;
      case RIGHT:
        if (!rightDisabled)
          tabListScroller.current.scrollTo({
            top: 0,
            left: scrollLeft + tabwidth,
            behavior: "smooth",
          });
        break;
      default:
        break;
    }
  };

  return (
    <div className="content-wrapper">
      <div className="tablist-wrapper">
        <span className={cx("chevron", { "chevron--disabled": leftDisabled })}>
          <i
            onClick={() => onChevronClick(LEFT)}
            className="fas fa-chevron-left"
          ></i>
        </span>
        <div
          className="tab-list-scroller"
          ref={tabListScroller}
          onScroll={checkChevronActive}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={cx("tab-list", {
                    "tab-list__dragging": snapshot.isDraggingOver,
                  })}
                  {...provided.droppableProps}
                >
                  {tabList.map((tab, index) => (
                    <TabItem
                      tab={tab}
                      index={index}
                      is_tab_active={selectedTab === tab.id}
                      setSelectedTab={setSelectedTab}
                      deleteTab={deleteTab}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <span className={cx("chevron", { "chevron--disabled": rightDisabled })}>
          <i
            onClick={() => onChevronClick(RIGHT)}
            className="fas fa-chevron-right"
          ></i>
        </span>
        <span className="add-tab" onClick={addTab}>
          +
        </span>
      </div>
      <div className="tab-content">
        <p>{tabContents[selectedTab]}</p>
      </div>
    </div>
  );
}
