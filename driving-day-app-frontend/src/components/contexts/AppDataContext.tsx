import { createContext } from "react";
import { Driver } from "../../utils/Driver";

interface AppDataContextType {
    drivers: Driver[],
    isLoading: boolean
}

const AppDataContext = createContext<AppDataContextType>(
    { drivers: [], isLoading: true }
)

export default AppDataContext;