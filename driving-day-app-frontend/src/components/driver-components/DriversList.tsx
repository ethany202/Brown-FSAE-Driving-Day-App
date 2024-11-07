import React, { useState, useEffect } from "react";

interface DriversListProps {
    allDrivers: any
}

/**
 * 
 * @param allDrivers : List of JSON objects corresponding to all drivers and their profile information (i.e. height, weight, pedalbox distance) 
 * @returns 
 */
export default function DriversList({ allDrivers }: DriversListProps) {

    const [drivers, setDrivers] = useState<any>([])

    return (
        <div className="drivers-list-wrapper">
            {/**
             * 
             */}
            <div className="drivers-list">
                <table className="drivers-table">
                    <thead className="table-columns">
                        <tr>
                            <th></th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    )
}