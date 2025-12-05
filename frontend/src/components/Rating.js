import React from 'react'

function Rating({value,text,color}) {
  return (
    <div>
      {[1,2,3,4,5].map((star) => (
        <span key={star} >
          <i style={{color}} className={
            value >= star
              ? 'fas fa-star'
                : value >= star - 0.5
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
            }></i>  
        </span>
        ))}
        <span className="ms-2">{text && text}</span>
    </div>
  )
}

export default Rating
