import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import client from '../client'
import 'leaflet/dist/leaflet.css'
import './Map.css'

const customIcon = L.icon({    
    iconUrl: '/assets/iconpin.png',
    iconSize: [28, 34],             
})

const ZoomTracker = ({ setZoomLevel }) => {
    useMapEvents({
        zoomed: (e) => {
            const map = e.target
            setZoomLevel(map.getZoom())
        }
    })

    return null
}

export default function Map() {
    const [entries, setEntries] = useState([])
    const [zoomLevel, setZoomLevel] = useState(14)
    const navigate = useNavigate()

    const generateGoogleMapsLink = (lat, lng) => {
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    }
    
    useEffect(() => {
        client.fetch(`*[_type == "entry"]{
            _id, entrynumber, slug, title, location, city, address, typology, year, area, floors, material, otherinfo, images[]{asset->{url}}, "imageUrl": coverImage.asset->url}`)
            .then((data) => {
                const entriesWithCoords = data
                .filter(entry => entry.location && entry.location.lat && entry.location.lng)
                setEntries(entriesWithCoords)
            })
            .catch(console.error)
    }, [])

    return (
        <div className='map-container'>
            <MapContainer center={[40.269875518554834, 22.512032860239955]} zoom={zoomLevel} whenCreated={(map) => setZoomLevel(map.getZoom())}>
                <ZoomTracker setZoomLevel={setZoomLevel} />
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {entries.map((entry) => (
                    <Marker key={entry._id} position={[entry.location.lat, entry.location.lng]} icon={customIcon}>
                        <Popup>
                            <h3>ID #{entry.entrynumber}</h3>  
                            <img src={entry.imageUrl} alt={entry.title} style={{ width: '100px', height: 'auto', objectFit: 'fill' }} onClick={() => navigate(`/detail/${entry.slug.current}`)} />   
                            <br />                       
                            <a href={generateGoogleMapsLink(entry.location.lat, entry.location.lng)} target="_blank" rel="noopener noreferrer">
                                Open in Google Maps
                            </a>                            
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>            
        </div>
    )
}