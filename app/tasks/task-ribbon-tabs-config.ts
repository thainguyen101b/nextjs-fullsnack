import { TaskRibbonTab } from "../components/tasks/task-ribbon";

export const tabs: TaskRibbonTab[] = [
  {
    id: "file",
    name: "File",
    groups: [
      {
        id: "file-import-export",
        title: "Import/Export",
        commands: [
          {
            id: "file-import-export-import",
            label: "Import",
          },
          {
            id: "file-import-export-export",
            label: "Export",
          },
        ],
      },
    ],
  },
  {
    id: "home",
    name: "Home",
    groups: [
      {
        id: "home-task",
        title: "Task",
        commands: [
          {
            id: "home-task-new",
            label: "New task",
          },
          {
            id: "home-task-open",
            label: "Open",
            disabled: true,
          },
        ],
      },
    ],
  },
];
