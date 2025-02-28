import React, { useState } from "react";
import IssueModal from "./IssueModal";
import AddIssueModal from "./AddIssueModal";

interface Issue {
  id: number;
  driver: string;
  date: string;
  synopsis: string;
  subsystems: string[];
  description: string;
}

export default function IssueTable() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full font-face table-fixed">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "35%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-left font-medium text-lg">
                Issue #
              </th>
              <th className="px-6 py-4 text-left font-medium">Driver</th>
              <th className="px-6 py-4 text-left font-medium">Date</th>
              <th className="px-6 py-4 text-left font-medium">Synopsis</th>
              <th className="px-6 py-4 text-left font-medium">
                <div className="flex items-center justify-between">
                  <span>Subsystems</span>
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
            {issues.map((issue, index) => (
              <tr
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  setIsModalOpen(true);
                }}
                className={`cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                  index !== issues.length - 1 ? "border-b border-gray-100" : ""
                }`}
                tabIndex={0}
              >
                <td className="px-6 py-4 text-lg font-medium">{issue.id}</td>
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
              </tr>
            ))}
            {issues.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedIssue) => {
            setIssues(
              issues.map((i) => (i.id === updatedIssue.id ? updatedIssue : i))
            );
            setSelectedIssue(updatedIssue);
          }}
        />
      )}

      <AddIssueModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newIssue) => {
          setIssues([...issues, { ...newIssue, id: issues.length + 1 }]);
          setIsAddModalOpen(false);
        }}
        nextIssueNumber={issues.length + 1}
      />
    </div>
  );
}
