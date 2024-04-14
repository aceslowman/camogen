import React, { useState, useRef, useLayoutEffect } from 'react'
import DropDownComponent from './DropDownComponent'
import { observer } from 'mobx-react'

const ContextMenu = observer((props) => {
  const mainRef = useRef(null)
  let dropRef = useRef(null)

  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [dropDownPosition, setDropDownPosition] = useState({ top: 0, left: 0 })
  const [dropDownOpenLeft, setDropDownOpenLeft] = useState(false)
  const [dropDownOpenUp, setDropDownOpenUp] = useState(false)

  const handleClickAway = (e) => {
    if (mainRef.current && !mainRef.current.contains(e.target)) {
      setDropDownOpen(false)
    }
  }

  const handleClick = (e) => {
    e.preventDefault()

    // keep open with right click.
    setDropDownOpen(true)

    // adjust to keep menu in frame
    let x = e.pageX
    let y = e.pageY

    // 150 is the menu width, this shouldn't be hardcoded
    // but it's not in bounding box when first clicked
    if (e.pageX + 150 > window.innerWidth) x -= 150

    let _openUp = y > window.innerHeight - window.innerHeight / 3

    setDropDownOpenUp(_openUp)
    setDropDownOpenLeft(e.pageX > window.innerWidth / 2)
    setDropDownPosition({
      top: !_openUp ? y : 'auto',
      bottom: _openUp ? window.innerHeight - y : 'auto',
      left: x
    })

    return false
  }

  const handleRef = (e) => {
    dropRef = e
  }

  useLayoutEffect(() => {
    document.addEventListener('click', (e) => handleClickAway(e), true)
    document.addEventListener('contextmenu', (e) => handleClick(e), true)

    return () => {
      document.removeEventListener('click', (e) => handleClickAway(e), true)
      document.removeEventListener('contextmenu', (e) => handleClick(e), true)
    }
  }, [])

  return (
    <div ref={mainRef}>
      {/* <div style={{
                position: 'absolute',
                top: dropDownPosition.top,
                left: dropDownPosition.left,
                fontSize: '2em',
                zIndex: 10000
            }}>
                ⌖
            </div> */}
      <DropDownComponent
        open={dropDownOpen}
        items={props.items}
        position={dropDownPosition}
        onRef={handleRef}
        openLeft={dropDownOpenLeft}
        openUp={dropDownOpenUp}
      />
    </div>
  )
})

export default ContextMenu
