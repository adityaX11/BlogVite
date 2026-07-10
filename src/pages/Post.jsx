// import React, {useEffect, useState} from 'react'
// import { Link, useNavigate, useParams} from "react-router-dom"

// import appwriteService from "../appwrite/config"
// import Button from "../components/Button"
// import Container from "../components/container/Container"
// import parse from "html-react-parser"
// import {useSelector } from "react-redux"

// function Post() {
//   const [post, setPost] = useState(null)
//   const {slug} = useParams()
//   const navigate = useNavigate()
//   const userData = useSelector((state) => state.auth.userData)
//   const isAuthor = post && userData ? post.userId === userData.$id : false

//   useEffect(() => {
//     if (slug) {
//       appwriteService.getPost(slug).then((post) => {
//         if (post) {
//           setPost(post)
//         }else {
//           navigate("/")
//         }
//       })
//     }
//   }, [slug, navigate])

//   const deletePost = () => {
//     appwriteService.deletePost(post.$id).then((status) => {
//       if (status) {
//         appwriteService.deleteFile(post.featuredImage);
//         navigate("/")
//       }
//     })
//   }
//   return post ? (
//     <div className="py-8">
//       <Container>
//         <div className='w-full flex justify-center mb-4 relative border rounded-xl p-2'>
//           <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} className='rounded-xl' />
//           { isAuthor && (
//             <div className="absolute-right-6 top-6">
//               <Link to={`/edit-post/${post.$id}`}>
//                 <Button bgColor="bg-green-500" className="mr-3">Edit</Button>
//               </Link>
//               <Button bgColor="bg-red-500" 
//               onClick={deletePost}
//               >Delete</Button>
//             </div>
//           )}
//         </div>
//         <div className="w-full mb-6">
//           <h1 className="text-2xl font-bold">{post.title}</h1>
//           <div className="browser-css">
//             {parse(post.content)}
//           </div>
//         </div>
//       </Container>
//     </div>
//   ) : null
// }

// export default Post


// error free code
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import Button from "../components/Button";
import Container from "../components/container/container";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Post() {
  const [post, setPost] = useState(null);
  const [imageVersion, setImageVersion] = useState(0);
  const [imageError, setImageError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [repairAttempted, setRepairAttempted] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;
  const imageId = post?.featureImg || post?.featuredImage || "";
  const previewUrl = imageId ? appwriteService.getFilePreview(imageId) : "";
  const imageUrl = imageId
    ? `${previewUrl}${previewUrl.includes("?") ? "&" : "?"}v=${imageVersion}`
    : "";

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setImageError("");
          setImageFailed(false);
          setRepairAttempted(false);
          setImageVersion(0);
          setPost(post);
        } else navigate("/");
      });
    }
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        // ✅ FIX: featureImg not featuredImage
        if (imageId) {
          appwriteService.deleteFile(imageId);
        }
        navigate("/");
      }
    });
  };

  const repairImagePermissions = async () => {
    if (repairAttempted) {
      setImageFailed(true);
      setImageError("Image is blocked by Appwrite storage permissions.");
      return;
    }

    setRepairAttempted(true);

    if (!imageId || !userData?.$id || !isAuthor) {
      setImageFailed(true);
      setImageError("Image is blocked by Appwrite storage permissions.");
      return;
    }

    const updatedFile = await appwriteService.makeFileReadable(imageId, userData.$id);

    if (updatedFile) {
      setImageFailed(false);
      setImageError("");
      setImageVersion((version) => version + 1);
    } else {
      setImageFailed(true);
      setImageError("Image is blocked by Appwrite storage permissions.");
    }
  };

  return post ? (
    <div className="py-8">
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          {/* ✅ FIX: featureImg + safe check */}
          {imageId && !imageFailed ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="rounded-xl"
              onError={repairImagePermissions}
            />
          ) : (
            <div className="flex min-h-64 w-full items-center justify-center rounded-xl bg-gray-200 px-4 text-center text-gray-600">
              Image unavailable
            </div>
          )}

          {isAuthor && (
            // ✅ FIX: absolute-right-6 ❌ -> right-6 ✅
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>

              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <div className="browser-css">{parse(post.content)}</div>
          {imageError && (
            <p className="mt-4 text-sm text-red-600">{imageError}</p>
          )}
        </div>
      </Container>
    </div>
  ) : null;
}

export default Post;
