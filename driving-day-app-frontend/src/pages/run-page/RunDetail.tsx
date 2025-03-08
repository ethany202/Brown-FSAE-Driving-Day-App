import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import SpecificRunBubble from '../../components/run-components/SpecificRunBubble';
import LineChartTemplate from '../../components/graph-components/LineChartTemplate';
import PageBase from '../../components/base-component/PageBase';
import './ChartElements.css';
import { getSpecificRunData } from '../../api/api';
import { CATEGORIES } from '../../utils/DataTypes';
import { Driver } from '../../utils/DriverType';


const RunDetailRevised: React.FC = () => {
    
    const {runTitle} = useParams()

    // Adapt this into DataTypes.ts
    const keyCategories = ["Highest Coolant Temperature"]

    const [isLoading, setLoading] = useState<boolean>(true);
    const [driver, setDriver] = useState<Driver>({
        driverId: 'UNDEF',
        firstName: 'UNDEF',
        lastName: 'UNDEF',
        height: -1,
        weight: -1,
        pedalBoxPos: -1
    })
    // Array of JSON entries
    const [runDataPoints, setRunDataPoints] = useState<any[]>([])
    // JSON entries of most important points
    const [keyPoints, setKeyPoints] = useState<JSON>(JSON.parse("{}"))

    // States to store the currently-toggled column
    const [verticalLabel, setVerticalLabel] = useState<string>(CATEGORIES.ENG_OIL_PRESSURE)
    const [horizontalLabel, setHorizontalLabel] = useState<string>("Time")
    

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

        // Update driver too
    }

    
    useEffect(() => {
        // USE localStorage to cache in the future
        // Flush data out after 1 week or browser reaches max memory
        /**
         * Item Structure:
         *      key: runTitle,
         *      expiry: <1 Week date time>
         *      value: JSON.stringify(<content>)
         */
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
                        keyPoints={keyPoints}
                        keyCategories={keyCategories}
                        driver={driver}
                        />
                ) : (
                    <p className="text-lg text-gray-600">Run details not found.</p>
                )}

                <div className="pt-16">
                    <h1>Graphs</h1>
                    <div className="flex">
                        {/**
                         * TODO: Load in ALL unique columns for this
                         * 
                         * 
                         */}
                        <select className="text-lg px-4 py-2 border border-gray-200 rounded-md text-blue-800 font-semibold text-1xl"
                            onChange={(event) => setVerticalLabel(event.target.value)}
                        >
                            <option value={CATEGORIES.ENG_OIL_PRESSURE}>
                                <section>{CATEGORIES.ENG_OIL_PRESSURE}</section>
                            </option>
                        </select>

                        <section className="px-4 py-2">
                            vs 
                        </section>
                        <select className="text-lg px-4 py-2 border border-gray-200 rounded-md text-red-800 font-semibold text-1xl"
                            // onChange={(event) => setHorizontalLabel(event.target.value)}
                        >
                            <option value="">
                                <section>{"Time"}</section>
                            </option>
                        </select>
                    </div>
                    <LineChartTemplate 
                        frequency={1}
                        categoryName={CATEGORIES.ENG_OIL_PRESSURE}
                        verticalLabel={verticalLabel}
                        horizontalLabel={horizontalLabel}
                        chartPoints={runDataPoints}
                    />
                </div>
            </div>
        </PageBase>
    );

};

export default RunDetailRevised;