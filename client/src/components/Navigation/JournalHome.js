import React from 'react'
import SearchBar from '../SearchBar'
import NoteManager from '../smallComponents/NoteManager'
import { Segment, Search } from 'semantic-ui-react';


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