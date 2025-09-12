"use client";

import { useState } from "react";

export type TaskRibbonCommand = {
  id: string;
  label: string;
  tooltip?: string;
  disabled?: boolean;
};

export type TaskRibbonGroup = {
  id: string;
  title: string;
  commands: TaskRibbonCommand[];
};

export type TaskRibbonTab = {
  id: string;
  name: string;
  groups: TaskRibbonGroup[];
};

type TaskRibbonProps = {
  tabs: TaskRibbonTab[];
  onCmd: (cmdId: string) => void;
};

export default function TaskRibbon({ tabs, onCmd }: TaskRibbonProps) {
  if (!tabs || tabs.length === 0) throw new Error("task ribbon define error");
  const defaultActiveTab = tabs.length > 1 ? tabs[1] : tabs[0];
  const [activeTabId, setActiveTabId] = useState<string>(defaultActiveTab.id);
  const activeTab = tabs.find((t) => t.id === activeTabId)!;

  return (
    <div>
      {/* Upper ribbon */}
      <div role="tablist" aria-label="Task Ribbon Tabs" className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTabId(tab.id)}
            className={`px-4 py-2 focus:outline-none ${
              activeTabId === tab.id
                ? "bg-sky-600 border-t-2 border-t-sky-700"
                : ""
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Lower ribbon */}
      <div id={`panel-${activeTab.id}`} role="tabpanel" className="flex gap-6">
        {activeTab.groups.map((group) => (
          <div
            key={group.id}
            className="flex flex-col py-2"
            title={group.title}
          >
            <div className="flex flex-wrap gap-2">
              {group.commands.map((cmd) => (
                <button
                  key={cmd.id}
                  title={cmd.tooltip ?? cmd.label}
                  onClick={() => onCmd(cmd.id)}
                  disabled={cmd.disabled}
                  className="hover:underline hover:underline-offset-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
