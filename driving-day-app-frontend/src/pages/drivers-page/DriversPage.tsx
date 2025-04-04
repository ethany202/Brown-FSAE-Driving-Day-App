import React from "react";
import DriversList from "../../components/driver-components/DriversList";
import PageBase from "../../components/base-component/PageBase";

export default function DriversPage() {

    // TODO: Move entire DriversList code here
    // Modularize DriversList.tsx into multiple components
    return (
        <PageBase>
            <DriversList />
        </PageBase>
    )
}