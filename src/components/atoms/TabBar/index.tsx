import React, { useMemo } from "react";

type Props = {};

const TabBar = (props: any) => {
  const { items, activeTab, onTabClick } = props;

  const displayChildren = useMemo(() => {
    return items.find((r) => r.key === activeTab)?.children || "";
  }, [activeTab]);

  return (
    <div>
      <div className="d-flex scroll-hide-bar ">
        {items.map((r: any, i: number) => {
          return (
            <div
              onClick={() => {
                onTabClick && onTabClick(r.key);
              }}
              key={r.key}
              className={`px-4 py-2 ${
                r.key === activeTab && "bg-white "
              } mx-1 rounded-top fs-4 clickable bg-transition`}
              style={{ whiteSpace: "nowrap" }}
            >
              {r.label}
            </div>
          );
        })}
      </div>
      {displayChildren}
    </div>
  );
};

export default TabBar;
