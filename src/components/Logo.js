import React from 'react'
import {Tilt} from 'react-tilt'
import  './LogoD.css'
import Brain from'./brain.png'

const Logo= ()=> {
    return (
      <div className="ma4 mt0">
             <Tilt className="Tilt br2 shadow-2 " options={{max:55}} style={{ height: 150, width: 150 }}>
                <div className="Tilt-inner">
                  <img alt='Logos' src={Brain}></img>
                </div>
             </Tilt>
      </div>
    )
  }

export default Logo