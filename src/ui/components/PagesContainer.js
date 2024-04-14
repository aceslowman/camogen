import React, { useState, useContext } from 'react'
import * as styles from './PagesContainer.module.css'
import UIContext from '../UIContext'

const Pages = (props) => {
  const [currentPage, setCurrentPage] = useState(0)
  const context = useContext(UIContext).theme

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage + 1 < props.children.length) setCurrentPage(currentPage + 1)
  }

  const buttonStyle = {
    backgroundColor: context.secondary_color,
    color: context.text_color
  }

  return (
    <div className={styles.wrapper} style={props.style}>
      <div className={styles.pagecontent}>{props.children[currentPage]}</div>
      <div className={styles.pagenav}>
        <button style={buttonStyle} onClick={handlePreviousPage}>
          {'<'}
        </button>
        <button style={buttonStyle} onClick={handleNextPage}>
          {'>'}
        </button>
        <span>{`${currentPage + 1} of ${props.children.length}`}</span>
      </div>
    </div>
  )
}

export default Pages
