import React from 'react'
import { useEffect, useState } from 'react'
import client from '../client'
import { useNavigate } from 'react-router-dom'
import './Homepage.css'

export default function Homepage() {
    const [entries, setEntries] = useState([])
    const [shuffledCells, setShuffledCells] = useState([])
    const [activeFilter, setActiveFilter] = useState(null)
    
    const navigate = useNavigate()
   
    
    useEffect(() => {
        client.fetch(`*[_type == "entry"]{
            title, slug, entrynumber, city, address, typology, year, area, floors, material, otherinfo, coverImage{asset->{url}}, images[]{asset->{url}}}`)
            .then((data) => {
                setEntries(data)
                const cells = generateCells(data)
                setShuffledCells(shuffleArray(cells))                
            })
            .catch(console.error)
    }, [])

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5)
    }

    const generateCells = (entries) => {
        const cells = []

        entries.forEach((entry) => {
            cells.push({
                type: "image",
                entry,
            })

            cells.push({
                type: "text",
                contentType: "typology",
                value: entry.typology,
                entry,
            })

            cells.push({
                type: "text",
                contentType: "city",
                value: entry.city,
                entry,
            })
        })

        return cells
    }

    const handleFilterClick = (cell, index) => {
        if (!activeFilter || activeFilter.value !== cell.value || activeFilter.index !== index) {
            setActiveFilter({ type: cell.contentType, value: cell.value, index: index, })
        } else {
            setActiveFilter(null)
        }
    }

    const handleImageClick = (slug) => {
        navigate(`/detail/${slug.current}`)
    }

    
    const isCellFaded = (cell, index) => {
        if (!activeFilter) return false

        if (cell.type === "image") {
            return cell.entry[activeFilter.type] !== activeFilter.value
        }

        if (cell.type === "text") {
            if (cell.contentType === activeFilter.type && cell.value === activeFilter.value) {
                return index !== activeFilter.index
            }
            return true
        }

        return false
    }

    const isCellClickable = (cell) => {
        if (!activeFilter) return true

        if (cell.type === "image") {
            return cell.entry[activeFilter.type] === activeFilter.value
        }

        return cell.value === activeFilter.value
    }
    
    return (
        <div className='homepage-container'>
            <div className='grid-container'>
                {shuffledCells.map((cell, index) => {
                    const faded = isCellFaded(cell, index)
                    const clickable = isCellClickable(cell)

                    return (
                        <div key={index} className={`grid-cell ${faded ? "faded" : ""} ${
                            clickable ? "clickable" : "disabled"
                        }`} onClick={() => {
                            if (!clickable) return

                            if (cell.type === 'image') {
                                handleImageClick(cell.entry.slug)
                            } else {
                                handleFilterClick(cell, index)
                            }
                        }}>
                            {cell.type === 'image' ? (
                                <img src={cell.entry.coverImage.asset.url} alt={cell.entry.typology} className="cell-image" />

                            ) : (
                                <div className='cell-text'>{cell.value}</div>
                            )}
                        </div>
                    )
                })}
            </div>

            
        </div>
    )
}