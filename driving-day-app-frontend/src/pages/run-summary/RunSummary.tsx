import React, {useState, useEffect} from "react";
// import RunBubble from "../../components/run-components/RunBubble";
import GeneralRunBubble from "../../components/run-components/GeneralRunBubble";
import { useNavigate } from "react-router-dom";
import { getGeneralRunData } from "../../api/api";
import { Driver } from "../../utils/DriverType";

const RunsSummaryPage: React.FC = () => {

  const navigate = useNavigate();
  const templateDriver : Driver = {
    driverId: 'UNDEF',
    firstName: 'UNDEF',
    lastName: 'UNDEF',
    height: -1,
    weight: -1,
    pedalBoxPos: -1
  }
  const [isLoading, setLoading] = useState<boolean>(true);
  // JSON array of general run data
  const [generalRuns, setGeneralRuns] = useState<any[]>([])
  
  const handleRunClick = (runTitle: string) => {
    navigate(`/runs/${runTitle}`);
  };

  const fetchGeneralRunData = async () => {
    const response = await getGeneralRunData({
      // TOOO: Detect filters
    })
    if (response.status === 200){
      console.log(response.data)
      setGeneralRuns(response.data.recentRuns)
    }

  }

  useEffect(() => {
    fetchGeneralRunData()
  }, [])

  return (
    <div className="page-content-main">
      <div className="w-full">
        <div className="p-8 max-w-7xl mx-auto">
          <h1 className="mb-6 text-2xl font-semibold">Summary of Runs</h1>

          {/** Create Actual Filtering System */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="10/15/2024">Date: 10/15/2024</option>
            </select>

            <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="all">Driver: All</option>
            </select>

            <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="engine">Filter by: Engine</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {generalRuns.map((generalRun) => (
              <GeneralRunBubble
                key={generalRun.id}
                runTitle={generalRun.id}
                driver={templateDriver}
                onClick={() => handleRunClick(generalRun.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunsSummaryPage;
