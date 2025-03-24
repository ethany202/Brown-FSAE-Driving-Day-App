import React, {useState, useEffect, useContext} from 'react'
import ChartContext from '../../components/contexts/ChartContext';
import { useParams, useLocation } from 'react-router-dom';
import SpecificRunBubble from '../../components/run-components/SpecificRunBubble';
import PageBase from '../../components/base-component/PageBase';
import './ChartElements.css';
import { getSpecficiRunDataPaginated } from '../../api/api';
import { CATEGORIES, ReusableChartProps, StandardChartProps } from '../../utils/DataTypes';
import { CHARTS, ChartCategory } from '../../utils/ChartTypes';


const RunDetailRevised: React.FC = () => {
    
    const { chartMapping, globalCategories, globalPageSize } = useContext(ChartContext)
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
    const [verticalLabel, setVerticalLabel] = useState<string>("<Vertical Label>")
    const [horizontalLabel, setHorizontalLabel] = useState<string>("Time")
    
    const [previousDocId, setPreviousDocId] = useState<string>("")

    /**
     * useState variables for chart-data
     */
    const chartCategories : ChartCategory[] = Object.values(CHARTS)
    const [currChartInd, setCurrChartInd] = useState<number>(0)
    const CurrentChart : React.FC<StandardChartProps> = chartMapping[currChartInd]

    /**
     * useState variables for chart-columns
     */
    const [chartColumns, setChartColumns] = useState<string[]>([])


    const updateChartColumns = (allColumns : string[]) => {
        setChartColumns(allColumns.filter((col) => globalCategories.has(col)))
    }

    /**
     * Perform fetch call to pull specific run data, but paginated (only specific rows are pulled, when toggled)
     */
    const fetchSpecificRunDataPaginated = async () => {
        const response = await getSpecficiRunDataPaginated({
            runTitle: runTitle || "sample_data",
            pageSize: globalPageSize,
            previousDocId: previousDocId,
            categories: [
                CATEGORIES.BR_PRESSURE_BACK,
                CATEGORIES.BR_PRESSURE_FRONT,
                CATEGORIES.COOL_TEMP,
                CATEGORIES.ENG_OIL_PRESSURE
            ]
        })

        if(response.status === 200){
            if(response.data.runDataPoints.length > 0){
                const pulledRunData : any[] = response.data.runDataPoints
                const pulledColumns : string[] = Object.keys(pulledRunData[0]) 

                updateChartColumns(pulledColumns)
                setPreviousDocId(pulledRunData[pulledRunData.length-1]['id'])
                setRunDataPoints(pulledRunData)
                setKeyPoints(response.data.keyPoints)

                setVerticalLabel(pulledColumns[0])
            }            
            setLoading(false)
        }
    }


    // TODO: Create fetch API call to obtain run meta-data by runTitle (called when necessary)
    // TODO: Create button to change page number
    
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

        fetchSpecificRunDataPaginated()
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
                            <section className='px-4 py-2'>Columns:</section>

                            <select className="text-lg px-4 py-2 border border-gray-200 rounded-md text-blue-800 font-semibold text-1xl"
                                onChange={(event) =>  {setVerticalLabel(event.target.value)}}
                            >
                                {chartColumns.map((validColumn, index) => {
                                    return (
                                        <option key={index} value={validColumn}>{validColumn}</option>
                                    )
                                })}

                            </select>

                            <section className="px-4 py-2"> vs </section>
                            <select className="text-lg px-4 py-2 border border-gray-200 rounded-md text-red-800 font-semibold text-1xl"
                                // onChange={(event) => setHorizontalLabel(event.target.value)}
                            >
                                <option value=""> {"Time"} </option>
                            </select>
                        </div>
                        <div className='flex py-2'>
                            <section className='px-4 py-2'>Chart Type:</section>
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
                        verticalLabel={verticalLabel}
                        horizontalLabel={horizontalLabel}
                        chartPoints={runDataPoints}
                        pageNumber={pageNumber}
                    />      
                    {/* {...props} : Method of passing in props as an object*/}
                </div>
            </div>
        </PageBase>
    );

};

export default RunDetailRevised;