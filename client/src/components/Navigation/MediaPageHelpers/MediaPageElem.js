import React from 'react'

/* Props 
Title: The heading;
Data: The data: 
*/ 



const MediaPageElem = props => {
    const {title, data, type} = props; 

    if (data === null) return null; 

    return (
        <div className = 'media-body-div'>
            <h1> {title} </h1>

        </div>
    )
}