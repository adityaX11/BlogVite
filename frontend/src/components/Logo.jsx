import React from 'react'

function Logo({width = "25%"}) {
  return (
    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjrBDW9DxHBUguc1Nt87OOQBTPppNgm_Sd6w&s'
     className='rounded-4xl  p-1 transition-all duration-600 hover:scale-105 hover:shadow-xl hover:shadow-black' style={{width}} alt='Logo placeholder' />
  )
}

export default Logo

// import React from 'react'

// function Logo({width='100px'}) {
//   return (
//     <div>
//       Logo
//     </div>
//   )
// }

// export default Logo
