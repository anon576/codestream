import React, { useState } from 'react'

const Expandable = ({ children, maxChar = 100 }) => {

    const [expand, setExpand] = useState(true)

    if (children.length <= maxChar) return <p>{children}</p>

    const text = expand ? children.substring(0, maxChar) : children

    return (
        <div className='expandable' style={{ fontSize: "1rem" }}>
            <span>{text}{expand ? "..." : ' '} <span onClick={() => { setExpand(!expand) }} style={{
                cursor: "pointer",
                color: "blue"
            }}>{expand ? "Show More" : "Show Less"}</span></span>

        </div>
    )
}

export default Expandable
