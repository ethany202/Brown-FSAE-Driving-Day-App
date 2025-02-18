import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SpecificRunBubble from '../../components/run-components/SpecificRunBubble';
import LineChartTemplate from '../../components/run-components/LineChartTemplate';
import './ChartElements.css';
import { getSpecificRunData } from '../../api/api';
import { CATEGORIES } from '../../utils/DataTypes';
import { Driver } from '../../utils/DriverType';


const RunDetailRevised: React.FC = () => {
    
    const {runTitle} = useParams()
    const navigate = useNavigate()


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
            <div className='page-content-main'>
                <div className="flex items-center justify-center h-64">
                    Loading run data...
                </div>
            </div>    
        );
    }

    return (
        <div className="page-content-main">

        <div className="w-full p-8">
            <div className="run-detail-chart">
                <h1 className="mb-6 text-2xl font-semibold">{`"${runTitle}" Details`}</h1>

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

                <div className="py-8">
                    <LineChartTemplate 
                        frequency={1}
                        categoryName={CATEGORIES.ENG_OIL_PRESSURE}
                        verticalLabel={"Engine Oil Pressure (kPa)"}
                        horizontalLabel={"Time (s)"}
                        chartPoints={runDataPoints}
                    />
                </div>
                
                </div>
            </div>
        </div>
    );

};

export default RunDetailRevised;