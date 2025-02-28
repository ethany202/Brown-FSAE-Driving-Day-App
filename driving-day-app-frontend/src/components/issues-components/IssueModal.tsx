import React, { useState } from "react";
import Modal from "./Modal";

interface Issue {
  id: number;
  driver: string;
  date: string;
  synopsis: string;
  subsystems: string[];
  description: string;
}

interface IssueModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  onSave: (issue: Issue) => void;
}

export default function IssueModal({
  issue,
  isOpen,
  onClose,
  onSave,
}: IssueModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedIssue, setEditedIssue] = useState(issue);
  const [isSubsystemDropdownOpen, setIsSubsystemDropdownOpen] = useState(false);

  const availableSubsystems = [
    "System 1",
    "System 2",
    "System 3",
    "System 4",
    "System 5",
    "System 6",
    "System 7",
    "System 8",
    "System 9",
    "System 10",
  ];

  const handleSubsystemToggle = (subsystem: string) => {
    setEditedIssue((prevIssue) => {
      if (prevIssue.subsystems.includes(subsystem)) {
        return {
          ...prevIssue,
          subsystems: prevIssue.subsystems.filter((s) => s !== subsystem),
        };
      } else {
        return {
          ...prevIssue,
          subsystems: [...prevIssue.subsystems, subsystem],
        };
      }
    });
  };

  React.useEffect(() => {
    setEditedIssue(issue);
  }, [issue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setEditMode(false);
        onClose();
      }}
    >
      <div className="p-6">
        {editMode ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(editedIssue);
              setEditMode(false);
            }}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Driver
                  </label>
                  <input
                    type="text"
                    value={editedIssue.driver}
                    onChange={(e) =>
                      setEditedIssue({
                        ...editedIssue,
                        driver: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                    placeholder="Driver"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={editedIssue.date}
                    onChange={(e) =>
                      setEditedIssue({
                        ...editedIssue,
                        date: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Synopsis
                </label>
                <input
                  type="text"
                  value={editedIssue.synopsis}
                  onChange={(e) =>
                    setEditedIssue({
                      ...editedIssue,
                      synopsis: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Synopsis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subsystems
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsSubsystemDropdownOpen(!isSubsystemDropdownOpen)
                    }
                    className="w-full border rounded p-2 text-left flex justify-between items-center"
                  >
                    <span>
                      {editedIssue.subsystems.length > 0
                        ? `Selected (${editedIssue.subsystems.length})`
                        : "Select subsystems"}
                    </span>
                    <span>{isSubsystemDropdownOpen ? "▲" : "▼"}</span>
                  </button>

                  {isSubsystemDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                      {availableSubsystems.map((subsystem) => (
                        <div
                          key={subsystem}
                          className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleSubsystemToggle(subsystem)}
                        >
                          <input
                            type="checkbox"
                            checked={editedIssue.subsystems.includes(subsystem)}
                            onChange={() => {}}
                            className="mr-2"
                          />
                          {subsystem}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                  {editedIssue.subsystems.map((subsystem) => (
                    <span
                      key={subsystem}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                    >
                      {subsystem}
                      <button
                        type="button"
                        className="ml-1.5 text-blue-800 hover:text-blue-900"
                        onClick={() => handleSubsystemToggle(subsystem)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={editedIssue.description}
                  onChange={(e) =>
                    setEditedIssue({
                      ...editedIssue,
                      description: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded h-32"
                  placeholder="Description"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setEditedIssue(issue);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Issue #{issue.id}</h2>
            </div>
            <div className="space-y-4">
              <p className="break-words">
                <strong>Driver:</strong> {issue.driver}
              </p>
              <p>
                <strong>Date:</strong> {issue.date}
              </p>
              <p className="break-words">
                <strong>Synopsis:</strong> {issue.synopsis}
              </p>
              <div>
                <strong>Subsystems:</strong>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {issue.subsystems.length > 0 ? (
                    issue.subsystems.map((subsystem) => (
                      <span
                        key={subsystem}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {subsystem}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 italic">
                      No subsystems assigned
                    </span>
                  )}
                </div>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="mt-2 whitespace-pre-wrap break-words overflow-hidden">
                  {issue.description}
                </p>
              </div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
