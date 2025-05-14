import React from "react";

interface DropdownFilterProps{
    filterCategory: string,
    allFilterOptions: string[],
    setFilterOption: React.Dispatch<React.SetStateAction<string | null>>
}

/**
 * 
 * Generates a dropdown component used to filter items based on something
 * 
 * @param param0 
 * @returns 
 */
export default function DropdownFilter({
    filterCategory,
    allFilterOptions,
    setFilterOption
} : DropdownFilterProps){

    const propagateFilterOption = (newFilterOption : string) => {
        setFilterOption(newFilterOption)
    }

    return (
        <select onChange={(event) => propagateFilterOption(event.target.value)} className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
            <option>Filter: {filterCategory}</option>
            {allFilterOptions.map(filterName => {
                return (
                    <option key={filterName} value={filterName}>
                        {filterName}
                    </option>
                )
            })}
        </select>
    )
}