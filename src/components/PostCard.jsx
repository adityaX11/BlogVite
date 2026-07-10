import React, {useState} from 'react'
import {Link} from "react-router-dom"
import {useSelector} from "react-redux"
import appwriteService from "../appwrite/config.js"

function PostCard({
    $id, title, featuredImage, featureImg, userId
}) {
  const imageId = featuredImage || featureImg
  const userData = useSelector((state) => state.auth.userData)
  const [imageVersion, setImageVersion] = useState(0)
  const [imageFailed, setImageFailed] = useState(false)
  const [repairAttempted, setRepairAttempted] = useState(false)

  const previewUrl = imageId ? appwriteService.getFilePreview(imageId) : ""
  const imageUrl = previewUrl
    ? `${previewUrl}${previewUrl.includes("?") ? "&" : "?"}v=${imageVersion}`
    : ""

  const repairImagePermissions = async () => {
    if (repairAttempted) {
      setImageFailed(true)
      return
    }

    setRepairAttempted(true)

    if (imageId && userData?.$id && userId === userData.$id) {
      const updatedFile = await appwriteService.makeFileReadable(imageId, userData.$id)

      if (updatedFile) {
        setImageFailed(false)
        setImageVersion((version) => version + 1)
        return
      }
    }

    setImageFailed(true)
  }

  return (
    <Link to={`/post/${$id}`}>
        <div
        className='w-full bg-gray-100 rounded-xl p-4'
        >
            <div
            className='w-full justify-center mb-4'
            >
                {imageUrl && !imageFailed ? (
                    <img
                    src={imageUrl}
                    alt={title}
                    className='rounded-xl'
                    onError={repairImagePermissions}
                    />
                ) : (
                    <div className='flex min-h-32 items-center justify-center rounded-xl bg-gray-200 px-4 text-center text-sm text-gray-600'>
                        Image unavailable
                    </div>
                )}
            </div>
            <h2 className='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard


// import React from 'react'
// import { Link } from 'react-router-dom' // <Link> tag work-> To navigate between pages in React WITHOUT refreshing the browser.
// import appwriteService from '../appwrite/config'


// function PostCard({$id, title, featuredImage}) {
//   return (
//     <link to={`/post/${$id}`}>
//         <div className='w-full bg-gray-100 rounded-xl p-4'>
//             <div className='w-full justify-center mb-4'>
//                 <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl' />
//             </div>
//             <h2 className='text-xl'>{title}</h2>
//         </div>
//     </link>
//   )
// }

// export default PostCard


// //<Link> = “Yo React, change the page but don’t reload my whole app.”
// //<Link> is used for SPA(single Page Application.) navigation — changing pages without breaking your app or reloading it.

// //<a> = “Reload everything and start over like it’s 2005.”
// // Due to <Link> tag react is the single page Application.

// //SPA = “You load the app once and vibe. No reloads, just smooth screen changes.”
