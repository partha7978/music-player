import React from 'react'
import SpotifyLogo from '../../assets/spotifyLogo.svg'
import ProfileIcon from '../../assets/Profile.svg'
const Sidenav = () => {
  return (
    <div className='sidenav__container'>
      <img className='spotify-logo' src={SpotifyLogo} alt="Spotify Logo" />
      <div className='profile-icon'>
        <img src={ProfileIcon} alt="Profile Icon" />
      </div>
    </div>
  )
}

export default Sidenav