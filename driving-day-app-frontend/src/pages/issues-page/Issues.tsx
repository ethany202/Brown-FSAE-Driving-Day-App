import React from "react";
import IssueTable from "../../components/issues-components/IssuesTable";

const Issues: React.FC = () => {
  return (
    <div className="page-content-main">
      <div className="w-full p-8">
        <div>
          <h1 className="mb-6 text-2xl font-semibold">Issues</h1>
          <IssueTable />
        </div>
      </div>
    </div>
  );
};

export default Issues;
