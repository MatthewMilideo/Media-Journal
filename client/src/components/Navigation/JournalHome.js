import React from 'react'
import SearchBar from '../SearchBar'
import NoteManager from '../smallComponents/NoteManager'
import { Segment, Search } from 'semantic-ui-react';


class JournalHome extends React.Component{
    state = {}

    componentDidMount() {

    }

    render(){
        return(
           <Segment> 
               <h1> Notes: </h1>
               <NoteManager type= 'ALL'/>
            </Segment>
        )
    }
}


export default JournalHome