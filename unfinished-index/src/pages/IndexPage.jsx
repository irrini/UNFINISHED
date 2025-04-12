import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import client from '../client'
import './IndexPage.css'


export default function IndexPage() {
    const [entries, setEntries] = useState([])
    const [filteredEntries, setFilteredEntries] = useState([])  
    
    const [uniqueCities, setUniqueCities] = useState([])
    const [uniqueTypologies, setUniqueTypologies] = useState([])
    const [uniqueMaterials, setUniqueMaterials] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState('')    
    const [hoveredEntry, setHoveredEntry] = useState(null)
    const rowRefs = useRef({})

    const navigate = useNavigate()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const initialFilters = {
        city: queryParams.get('city') || '',
        typology: queryParams.get('typology') || '',
        material: queryParams.get('material') || '',
        sortBy: queryParams.get('sortBy') || '',
        order: queryParams.get('order') || 'asc'
    }

    const [filters, setFilters] = useState(initialFilters)

    useEffect(() => {
        client.fetch(`*[_type == "entry"]{
            title, slug, entrynumber, city, address, typology, year, area, floors, material, otherinfo, coverImage{asset->{url}}, images[]{asset->{url}}}`)
            .then((data) => {
                setEntries(data)

                //Get unique filter values
                setUniqueCities([...new Set(data.map((item) => item.city))])
                setUniqueTypologies([...new Set(data.map((item) => item.typology))])
                setUniqueMaterials([...new Set(data.map((item) => item.material))])                
            })
            .catch(console.error)
    }, [])

    useEffect(() => {
        if (!filters.sortBy && entries.length > 0) {
            const defaultFilters = { ...filters, sortBy: 'entrynumber', order: 'asc' }
            setFilters(defaultFilters)
            const searchParams = new URLSearchParams(defaultFilters)
            navigate({ search: searchParams.toString() }, { replace: true })
        }
    }, [filters, entries])

    useEffect(() => {
        filterAndSortEntries()
    }, [entries, filters])
    
    const handleFilter = (field, value) => {
        const newFilters = { ...filters, [field]: filters[field] === value ? '' : value }
        setFilters(newFilters)

        const searchParams = new URLSearchParams(newFilters)
        navigate({ search: searchParams.toString() }, { replace: true })
        setDropdownOpen('')
    }

    const handleSort = (field) => {
        const isAsc = filters.sortBy === field && filters.order === 'asc'
        const newOrder = isAsc ? 'desc' : 'asc'
        const newFilters = { ...filters, sortBy: field, order: newOrder }
        setFilters(newFilters)

        const searchParams = new URLSearchParams(newFilters)
        navigate({ search: searchParams.toString() }, { replace: true })        
    }

    const filterAndSortEntries = () => {
        let updatedEntries = [...entries]

        if (filters.city) {
            updatedEntries = updatedEntries.filter((entry) => entry.city === filters.city)
        }
        if (filters.typology) {
            updatedEntries = updatedEntries.filter((entry) => entry.typology === filters.typology)
        }
        if (filters.material) {
            updatedEntries = updatedEntries.filter((entry) => entry.material === filters.material)
        }

        if (filters.sortBy) {
            updatedEntries.sort((a, b) => {
                if (filters.sortBy === 'entrynumber' || filters.sortBy === 'area') {
                    return filters.order === 'asc'
                    ? a[filters.sortBy] - b[filters.sortBy]
                    : b[filters.sortBy] - a[filters.sortBy]
                }
                return 0;
            })
        }

        setFilteredEntries(updatedEntries)
    }

    const renderSortArrow = (field) => {
        if (filters.sortBy !== field) return '↕'
        return filters.order === 'asc' ? '↑' : '↓'
    }

    return (
        <div className='index-container'>
            <table className='index-table'>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('entrynumber')}>ID {renderSortArrow('entrynumber')}</th>
                        <th>ADDRESS</th>
                        <th onClick={() => setDropdownOpen(dropdownOpen === 'city' ? '' : 'city')}
                            className={filters.city ? 'active-filter-header' : ''}>CITY {filters.city && `(${filters.city})`}{dropdownOpen === 'city' && (
                                <div className='dropdown'>
                                    {uniqueCities.map((city) => (
                                        <div key={city} onClick={(e) => {
                                            e.stopPropagation()
                                            handleFilter('city', city)
                                        }}
                                        className={filters.city === city ? 'dropdown-item active' : 'dropdown-item'}>
                                            {city} 
                                        </div>
                                    ))}
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        handleFilter('city', '')
                                    }} className='dropdown-item clear'>
                                        Clear
                                    </div>
                                </div>)}
                        </th>
                        <th onClick={() => setDropdownOpen(dropdownOpen === 'typology' ? '' : 'typology')} className={filters.typology ? 'active-filter-header' : ''}>
                            TYPOLOGY {filters.typology && `(${filters.typology})`}{dropdownOpen === 'typology' && (
                                <div className='dropdown'>
                                    {uniqueTypologies.map((typology) => (
                                        <div key={typology} onClick={(e) => {
                                            e.stopPropagation()
                                            handleFilter('typology', typology)
                                        }} className={filters.typology === typology ? 'dropdown-item active' : 'dropdown-item'}>
                                            {typology}
                                        </div>
                                    ))}
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        handleFilter('typology', '')
                                    }} className='dropdown-item clear'>
                                    Clear
                                    </div>
                                </div>)}
                        </th>
                        <th onClick={() => setDropdownOpen(dropdownOpen === 'material' ? '' : 'material')}
                            className={filters.material ? 'active-filter-header' : ''}>
                                MATERIAL {filters.material && `(${filters.material})`}{dropdownOpen === 'material' && (
                                    <div className='dropdown'>
                                        {uniqueMaterials.map((material) => (
                                            <div key={material} onClick={(e) => {
                                                e.stopPropagation()
                                                handleFilter('material', material)
                                            }} className={filters.material === material ? 'dropdown-item active' : 'dropdown-item'}>
                                                {material}
                                            </div>
                                        ))}
                                        <div onClick={(e) => {
                                            e.stopPropagation()
                                            handleFilter('material', '')
                                        }} className='dropdown-item clear'>Clear</div>
                                    </div>
                                )}
                        </th>
                        <th onClick={() => handleSort('area')}>SITE AREA {renderSortArrow('area')}</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredEntries.map((entry) => (
                        <tr 
                        key={entry.slug.current} 
                        ref={el => rowRefs.current[entry.slug.current] = el}
                        onClick={() => navigate(`/detail/${entry.slug.current}${location.search}`)} 
                        onMouseEnter={() => {
                            const rowElement = rowRefs.current[entry.slug.current]
                            const rect = rowElement?.getBoundingClientRect()
                            setHoveredEntry({
                                ...entry,
                                rowY: rect?.top + window.scrollY + rect?.height / 2
                            })
                        }}
                        style={{ cursor: 'pointer' }}                        
                        onMouseLeave={() => setHoveredEntry(null)}>
                            <td>{entry.entrynumber}</td>
                            <td>{entry.address}</td>
                            <td>{entry.city}</td>
                            <td>{entry.typology}</td>
                            <td>{entry.material}</td>
                            <td>{entry.area} m2</td>                                                     
                        </tr>
                    ))}
                </tbody>
            </table>
            {hoveredEntry?.coverImage?.asset?.url  && hoveredEntry?.rowY !== undefined && (
                <div
                className='hover-image-overlay'
                style={{ top: hoveredEntry.rowY }}
                onMouseLeave={() => setHoveredEntry(null)}
                >
                    <img src={hoveredEntry.coverImage.asset.url} alt={hoveredEntry.title} className='hover-image' />
                </div>
            )} 
        </div>
    )
}