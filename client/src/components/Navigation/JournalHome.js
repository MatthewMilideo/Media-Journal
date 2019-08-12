import React from 'react'
import NoteManager from '../smallComponents/NoteManager'


class JournalHome extends React.Component{
    state = {}


    render(){
        return(
            <div>
               <h1> Notes: </h1>
               <NoteManager type= 'ALL'/>
            </div> 
        )
    }
}


export default JournalHome