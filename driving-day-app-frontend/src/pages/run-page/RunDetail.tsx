import React, {useState, useEffect, useContext} from 'react'
import ChartMappingContext from '../../components/contexts/ChartMappingContext';
import { useParams, useLocation } from 'react-router-dom';
import SpecificRunBubble from '../../components/run-components/SpecificRunBubble';
import PageBase from '../../components/base-component/PageBase';
import './ChartElements.css';
import { getSpecificRunData } from '../../api/api';
import { CATEGORIES, ReusableChartProps } from '../../utils/DataTypes';
import { CHARTS, ChartCategory } from '../../utils/ChartTypes';

const dataPageSize : number = 20

const RunDetailRevised: React.FC = () => {
    
    const { chartMapping } = useContext(ChartMappingContext)
    const { runTitle } = useParams()
    const location = useLocation()

    /**
     * useState for Run Data metadata
     */
    const [isLoading, setLoading] = useState<boolean>(true);
    const [runDate, setRunDate] = useState<string>("")
    const [driverId, setDriverId] = useState<string>("")
    
    /**
     * useState for Pagination
     */
    const [pageNumber, setPageNumber] = useState<number>(1)


    // Adapt this into DataTypes.ts
    const keyCategories = ["Highest Coolant Temperature"]
    /**
     * useState variables for run-data
     */
    // Array of JSON entries
    const [runDataPoints, setRunDataPoints] = useState<any[]>([])
    // JSON entries of most important points
    const [keyPoints, setKeyPoints] = useState<JSON>(JSON.parse("{}"))
    // States to store the currently-toggled column
    const [verticalLabel, setVerticalLabel] = useState<string>(CATEGORIES.ENG_OIL_PRESSURE)
    const [horizontalLabel, setHorizontalLabel] = useState<string>("Time")
    
    /**
     * useState variables for chart-data
     */
    const chartCategories : ChartCategory[] = Object.values(CHARTS)
    const [currChartInd, setCurrChartInd] = useState<number>(0)
    const CurrentChart : React.FC<ReusableChartProps> = chartMapping[currChartInd]

    /**
     * Perform fetch call to pull specific run data
     */
    const fetchSpecificRunData = async () => {
        const response = await getSpecificRunData({
            runTitle: runTitle || "sample_data",
            categories: [
                // CATEGORIES.BR_PRESSURE_FRONT, 
                // CATEGORIES.BR_PRESSURE_FRONT, 
                CATEGORIES.COOL_TEMP, 
                CATEGORIES.ENG_OIL_PRESSURE
            ]
        })
        if (response.status === 200) {
            setRunDataPoints(response.data.runDataPoints)
            setKeyPoints(response.data.keyPoints)
            setLoading(false)
        }
    }

    // TODO: Create fetch API call to obtain run meta-data by runTitle (called when necessary)
    
    useEffect(() => {
        // USE localStorage to cache in the future
        // Flush data out after 1 week or browser reaches max memory
        /**
         * Item Structure:
         *      key: runTitle,
         *      expiry: <1 Week date time>
         *      value: JSON.stringify(<content>)
         */
        if(location.state){
            setRunDate(location.state['run-date'])
            setDriverId(location.state['driver-id'])
        }

        fetchSpecificRunData()
    }, [])

    if (isLoading) {
        return (
            <PageBase>
                <div className="flex items-center justify-center h-64">
                    Loading run data...
                </div>
            </PageBase>    
        );
    }

    return (
        <PageBase>
            <div className="run-detail-chart">
                <h1>{`"${runTitle}" Details`}</h1>

                {runTitle ? (
                    <SpecificRunBubble
                        runTitle={runTitle}
                        runDate={runDate}
                        driverId={driverId}
                        keyPoints={keyPoints}
                        keyCategories={keyCategories}
                        />
                ) : (
                    <p className="text-lg text-gray-600">Run details not found.</p>
                )}

                <div className="pt-16">
                    <h1>Graphs</h1>
                    <div className='flex flex-col'>
                        <div className="flex py-2">
                            <section className='px-4 py-2'>Columns</section>

                            <select className="text-lg px-4 py-2 border border-gray-200 rounded-md text-blue-800 font-semibold text-1xl"
                                onChange={(event) => setVerticalLabel(event.target.value)}
                            >
                                <option value={CATEGORIES.ENG_OIL_PRESSURE}> {CATEGORIES.ENG_OIL_PRESSURE} </option>
                            </select>

                            <section className="px-4 py-2"> vs </section>
                            <select className="text-lg px-4 py-2 border border-gray-200 rounded-md text-red-800 font-semibold text-1xl"
                                // onChange={(event) => setHorizontalLabel(event.target.value)}
                            >
                                <option value=""> {"Time"} </option>
                            </select>
                        </div>
                        <div className='flex py-2'>
                            <section className='px-4 py-2'>Chart Type</section>
                            <select className="text-lg px-4 py-2 border border-gray-200 rounded-md text-purple-800 font-semibold text-1xl"
                                onChange={(event) => setCurrChartInd(Number(event.target.value))}
                            >
                                {chartCategories.map((category, index) => {
                                    return (
                                        <option key={index} value={index}> {category} </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>           

                    <CurrentChart 
                        frequency={1}
                        categoryName={verticalLabel}
                        verticalLabel={verticalLabel}
                        horizontalLabel={horizontalLabel}
                        chartPoints={runDataPoints}
                    />      
                    {/* {...props} : Method of passing in props as an object*/}
                </div>
            </div>
        </PageBase>
    );

};

export default RunDetailRevised;