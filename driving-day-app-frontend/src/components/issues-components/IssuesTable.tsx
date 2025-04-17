import React, { useState, useEffect } from "react";
import IssueModal from "./IssueModal";
import AddIssueModal from "./AddIssueModal";
import { getAllIssues } from "../../api/api";

interface Issue {
  id: string;
  issue_number: number;
  driver: string;
  date: string;
  synopsis: string;
  subsystems: string[];
  description: string;
  priority?: string;
  status?: string;
}

export default function IssueTable() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedIssueNumber, setSelectedIssueNumber] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllIssues();
      if (response.status !== 200) {
        throw new Error("Failed to fetch issues");
      }
      const updatedIssues = response.data.issues || [];
      setIssues(updatedIssues);
      if (selectedIssue) {
        const updatedSelected = updatedIssues.find(
          (issue: Issue) => issue.id === selectedIssue.id
        );
        setSelectedIssue(updatedSelected || null);
        const index = updatedIssues.findIndex(
          (issue: Issue) => issue.id === selectedIssue.id
        );
        setSelectedIssueNumber(
          index !== -1 ? updatedSelected.issue_number : null
        );
      }
    } catch (err) {
      setError("Failed to load issues. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    fetchIssues();
  };

  const getPriorityColor = (priority: string | undefined) => {
    const priorityLower = priority?.toLowerCase() || "unknown";
    switch (priorityLower) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-600 text-white";
      case "high":
        return "bg-red-100 text-red-800";
      case "critical":
        return "bg-red-800 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string | undefined) => {
    const statusLower = status?.toLowerCase() || "unknown";
    switch (statusLower) {
      case "closed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-yellow-600 text-white";
      case "open":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading && <p>Loading issues...</p>}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full font-face table-fixed">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left font-medium text-lg">
                Issue #
              </th>
              <th className="px-6 py-4 text-left font-medium">
                Directly Responsible Individuals
              </th>
              <th className="px-6 py-4 text-left font-medium">Date</th>
              <th className="px-6 py-4 text-left font-medium">Synopsis</th>
              <th className="px-6 py-4 text-left font-medium">Subsystems</th>
              <th className="px-6 py-4 text-left font-medium">Priority</th>
              <th className="px-6 py-4 text-left font-medium">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none"
                  >
                    Add Issue
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  setSelectedIssueNumber(issue.issue_number);
                  setIsModalOpen(true);
                }}
                className={`cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  issues.indexOf(issue) !== issues.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
                tabIndex={0}
              >
                <td className="px-6 py-4 text-lg font-medium">
                  {issue.issue_number}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="break-words">{issue.driver}</div>
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {issue.date}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium break-words">
                    {issue.synopsis}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
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
                      <span className="text-gray-500 italic">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${getPriorityColor(
                      issue.priority
                    )}`}
                  >
                    {issue.priority || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status || "Unknown"}
                  </span>
                </td>
              </tr>
            ))}
            {issues.length === 0 && !isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No issues found. Click "Add Issue" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          issueNumber={selectedIssueNumber ?? 0}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <AddIssueModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
        nextIssueNumber={
          issues.length > 0
            ? Math.max(...issues.map((i) => i.issue_number)) + 1
            : 1
        }
      />
    </div>
  );
}
