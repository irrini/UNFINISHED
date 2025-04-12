import React, { useState, useEffect } from 'react'
import client from '../client'
import './About.css'
import { PortableText } from '@portabletext/react'

export default function About() {
    const [about, setAbout] = useState(null)
    

    useEffect(() => {
        client.fetch(`*[_type == "about"]{description}`)
        .then ((data) => setAbout(data[0]))
        .catch(console.error)
    }, [])

    if (!about) return <div>Loading...</div>

    return (       
        <> 
        <div className='about-container'>
            <div className='about-content'>
                <PortableText value={about.description} />
            </div>            
        </div>
        </>
        
    )
    
}