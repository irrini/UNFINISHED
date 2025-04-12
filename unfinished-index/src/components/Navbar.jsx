import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
    return (
        <>
        <nav className='navbar'>
            <ul className='nav-links'>
                <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>EXPLORE</NavLink></li>
                <li><NavLink to="/indexpage" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>INDEX</NavLink></li>
                <li><NavLink to="/map" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>MAP</NavLink></li>
                <li><NavLink to="/about" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>ABOUT</NavLink></li>
                <li><NavLink to="/submit" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')}>SUBMIT</NavLink></li>
                
            </ul>
        </nav>
        </>
    )
}