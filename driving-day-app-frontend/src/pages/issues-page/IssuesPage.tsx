import React from "react";
import IssueTable from "../../components/issues-components/IssuesTable";
import PageBase from "../../components/base-components/PageBase";

const IssuesPage: React.FC = () => {
  return (
    <PageBase>
        <h1 className="mb-6 text-2xl font-semibold">Issues</h1>
        <IssueTable />
    </PageBase>
  );
};

export default IssuesPage;
