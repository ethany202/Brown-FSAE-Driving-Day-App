import { createContext } from "react";
import { Driver } from "../../utils/DriverType";

interface AppDataContextType {
    currUserId: string | null,
    drivers: Driver[],
    isLoading: boolean
}

const AppDataContext = createContext<AppDataContextType>(
    { currUserId: null, drivers: [], isLoading: true }
)

export default AppDataContext;