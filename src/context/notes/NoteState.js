import { useState } from 'react'
import NoteContext from './noteContext'

const NoteState = (props) => {
    const notes = [
        {
          "_id": "61d9db6917b1d77a1cfe6ed6",
          "user": "61d8ec22f14dba6e548023a4",
          "title": "My title",
          "description": "Wake up early",
          "tag": "personal",
          "date": "2022-01-08T18:43:53.663Z",
          "__v": 0
        },
        {
          "_id": "61daec807d4468ebe8d9af18",
          "user": "61d8ec22f14dba6e548023a4",
          "title": "My title1",
          "description": "Wake up early everyone",
          "tag": "personal",
          "date": "2022-01-09T14:09:04.219Z",
          "__v": 0
        }
      ]
    return (
        <NoteContext.Provider value={notes}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState
