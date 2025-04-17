import React, { useState } from "react";
import Modal from "./Modal";
import { postIssue } from "../../api/api";

interface AddIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  nextIssueNumber: number;
}

interface Issue {
  id?: string;
  issue_number: number;
  driver: string;
  date: string;
  synopsis: string;
  subsystems: string[];
  description: string;
  priority: string;
  status: string;
}

export default function AddIssueModal({
  isOpen,
  onClose,
  onSave,
  nextIssueNumber,
}: AddIssueModalProps) {
  const [issue, setIssue] = useState<Issue>({
    issue_number: nextIssueNumber,
    driver: "",
    date: new Date().toISOString().split("T")[0],
    synopsis: "",
    subsystems: [],
    description: "",
    priority: "Low",
    status: "Open",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const availableSubsystems = [
    "BRK",
    "CHAS",
    "COOL",
    "DASH",
    "DRV",
    "DRIVER GEAR",
    "ELE",
    "ENGN",
    "ERGO",
    "EXH",
    "FEUL",
    "INT",
    "PDL",
    "STR",
    "SUS",
    "SHFT",
  ];

  const priorityLevels = ["Low", "Medium", "High", "Critical"];
  const statusOptions = ["Open", "In Progress", "Closed"];

  const handleSubsystemToggle = (subsystem: string) => {
    setIssue((prevIssue) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!issue.driver || !issue.date || !issue.synopsis || !issue.description) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    if (issue.issue_number < 1) {
      setError("Issue number must be a positive integer.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await postIssue({
        issue_number: issue.issue_number,
        driver: issue.driver,
        date: issue.date,
        synopsis: issue.synopsis,
        subsystems: issue.subsystems,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
      });

      if (response.status !== 201) {
        throw new Error("Failed to create issue");
      }

      setIssue({
        issue_number: nextIssueNumber + 1,
        driver: "",
        date: new Date().toISOString().split("T")[0],
        synopsis: "",
        subsystems: [],
        description: "",
        priority: "Low",
        status: "Open",
      });
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error adding issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Add New Issue</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Issue Number
            </label>
            <input
              type="number"
              min="1"
              value={issue.issue_number}
              onChange={(e) =>
                setIssue({
                  ...issue,
                  issue_number: parseInt(e.target.value),
                })
              }
              className="w-full border rounded p-2"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Directly Responsible Individuals
              </label>
              <input
                type="text"
                value={issue.driver}
                onChange={(e) => setIssue({ ...issue, driver: e.target.value })}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={issue.date}
                onChange={(e) => setIssue({ ...issue, date: e.target.value })}
                className="w-full border rounded p-2"
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Synopsis</label>
            <input
              type="text"
              value={issue.synopsis}
              onChange={(e) => setIssue({ ...issue, synopsis: e.target.value })}
              className="w-full border rounded p-2"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Priority Level
              </label>
              <select
                value={issue.priority}
                onChange={(e) =>
                  setIssue({ ...issue, priority: e.target.value })
                }
                className="w-full border rounded p-2"
                disabled={isLoading}
              >
                {priorityLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={issue.status}
                onChange={(e) => setIssue({ ...issue, status: e.target.value })}
                className="w-full border rounded p-2"
                disabled={isLoading}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subsystems</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full border rounded p-2 text-left flex justify-between items-center"
                disabled={isLoading}
              >
                <span>
                  {issue.subsystems.length > 0
                    ? `Selected (${issue.subsystems.length})`
                    : "Select subsystems"}
                </span>
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                  {availableSubsystems.map((subsystem) => (
                    <div
                      key={subsystem}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSubsystemToggle(subsystem)}
                    >
                      <input
                        type="checkbox"
                        checked={issue.subsystems.includes(subsystem)}
                        onChange={() => {}}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      {subsystem}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              {issue.subsystems.map((subsystem) => (
                <span
                  key={subsystem}
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
                >
                  {subsystem}
                  <button
                    type="button"
                    className="ml-1.5 text-blue-800 hover:text-blue-900"
                    onClick={() => handleSubsystemToggle(subsystem)}
                    disabled={isLoading}
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
              value={issue.description}
              onChange={(e) =>
                setIssue({ ...issue, description: e.target.value })
              }
              className="w-full border rounded p-2 h-32"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
