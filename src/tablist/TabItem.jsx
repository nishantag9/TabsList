import React from "react";
import { Draggable } from "react-beautiful-dnd";
import cx from "classnames";

const TabItem = ({ tab, index, is_tab_active, setSelectedTab, deleteTab }) => {
  return (
    <Draggable key={tab.id} draggableId={tab.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cx(
            "tab-item",
            {
              "tab-item__dragging": snapshot.isDragging,
            },
            { "tab-item__active": is_tab_active }
          )}
          style={{ ...provided.draggableProps.style}}
          onClick={() => setSelectedTab(tab.id)}
        >
          {tab.label}
          <span
            className="tab-item__delete"
            onClick={(e) => deleteTab(e, tab.id, tab.label)}
          >
            {" "}
            x{" "}
          </span>
        </div>
      )}
    </Draggable>
  );
};

export default TabItem;
