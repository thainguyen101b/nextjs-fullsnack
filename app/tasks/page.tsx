"use client";

import { useState } from "react";
import TaskRibbon from "../components/tasks/task-ribbon";
import { tabs } from "./task-ribbon-tabs-config";
import Modal from "../components/modal";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<"task" | "calendar">("task");
  const [open, setOpen] = useState(false);

  function handleTaskRibbonCommand(cmdId: string) {
    switch (cmdId) {
      case "file-import-export-import":
        alert("import");
        break;
      case "file-import-export-export":
        alert("export");
        break;
      case "home-task-new":
        alert("new");
        break;
      case "home-task-open":
        alert("open");
        break;
      default:
        throw new Error("Unhandled command: " + cmdId);
    }
  }

  return (
    <div>
      <TaskRibbon
        tabs={tabs}
        onCmd={(cmdId: string) => handleTaskRibbonCommand(cmdId)}
      />

      <div
        role="tablist"
        aria-label="Task Tabs"
        className="flex gap-2 text-2xl"
      >
        <button
          id="task"
          role="tab"
          aria-selected={activeTab === "task"}
          aria-controls="panel-task"
          onClick={() => setActiveTab("task")}
          className={`${activeTab === "task" ? "text-primary" : ""}`}
        >
          task
        </button>
        <button
          id="calendar"
          role="tab"
          aria-selected={activeTab === "calendar"}
          aria-controls="panel-calendar"
          onClick={() => setActiveTab("calendar")}
          className={`${activeTab === "calendar" ? "text-primary" : ""}`}
        >
          calendar
        </button>
      </div>

      {/* Task panel */}
      <div id="panel-task" role="tabpanel" hidden={activeTab !== "task"}>
        task's content
      </div>
      {/* Calendar panel */}
      <div
        id="panel-calendar"
        role="tabpanel"
        hidden={activeTab !== "calendar"}
      >
        calendar's content
      </div>

      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 rounded bg-primary text-primary-foreground"
      >
        Open Modal
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Deactivate account"
      >
        <p className="text-sm">
          Thao tác này sẽ vô hiệu hóa tài khoản của bạn. Bạn có chắc không?
        </p>
      </Modal>
    </div>
  );
}
