import React from 'react'
import { useEffect, useState } from 'react'
import { PortableText } from '@portabletext/react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../client'
import ChevronLeft from '../components/ChevronLeft'
import ChevronRight from '../components/ChevronRight'
import './DetailPage.css'

export default function DetailPage() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const { slug } = useParams()
    const navigate = useNavigate()    
    const [entry, setEntry] = useState(null)

    useEffect(() => {
        client.fetch(`*[_type == "entry" && slug.current == $slug][0]{
            _id, title, slug, entrynumber, city, address, typology, year, area, floors, material, otherinfo, coverImage{asset->{url}}, images[]{asset->{url}}}`, { slug } )
            .then((data) => {
                setEntry(data)
            })
            .catch(console.error)
    }, [slug])
    
    useEffect(() => {
        setCurrentImageIndex(0)        
    }, [entry])

    const nextImage = () => 
        setCurrentImageIndex((prev) => 
            prev + 1 === entry.images?.length ? 0 : prev + 1)    

    const prevImage = () => 
        setCurrentImageIndex((prev) => 
            prev === 0 ? entry.images?.length -1 : prev - 1)

    const handleFilterClick = (filterType, value) => {
        if (!value) return
        const searchParams = new URLSearchParams()
        searchParams.set(filterType, value) //Set the filter in URL
        navigate(`/indexpage?${searchParams.toString()}`) //Redirect to IndexPage with filters applied
    }    

    if (!entry) return <div>Loading...</div>
    
    return (      
    <div className='modal-overlay'> 
        <div className='modal-content'>            
                <div className='detail-info'>
                    <h3>ID #{entry.entrynumber}</h3>
                    <p><strong>City: </strong>{''}<span className='detail-clickable' onClick={() => handleFilterClick('city', entry.city)}>{entry.city}</span></p>
                    <p><strong>Address: </strong>{entry.address}</p>
                    <p><strong>Typology: </strong>{''}<span className='detail-clickable' onClick={() => handleFilterClick('typology', entry.typology)}>{entry.typology}</span></p>
                    <p><strong>Year: </strong>{entry.year}</p>
                    <p><strong>Area: </strong>{entry.area} m2</p>
                    <p><strong>Floors: </strong>{entry.floors}</p>
                    <p><strong>Material: </strong>{''}<span className='detail-clickable' onClick={() => handleFilterClick('material', entry.material)}>{entry.material}</span></p> 
                    <PortableText value={entry.otherinfo} /> 
                    <div>
                        <p><a href='mailto:irenepar222@gmail.com' className='contact-link'>Get in touch</a> if you know more about this building</p>
                    </div>                              
                </div>                
                    {entry.images && <div className='custom-slideshow'>
                        {entry.images.length > 1 &&
                        <button className='nav-button left' onClick={prevImage}>
                            <ChevronLeft />                            
                        </button>}
                        
                        <img src={entry.images[currentImageIndex].asset.url} className='slide-image' />
                        
                        {entry.images.length > 1 && 
                        <button className='nav-button right' onClick={nextImage}>
                            <ChevronRight />
                        </button>}                        
                    </div>}                          
        </div>   
        <button className='modal-close' onClick={() => navigate(-1)}>Back</button>
    </div>
    )    
}