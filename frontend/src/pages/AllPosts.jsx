// import React from 'react'
// import appwriteService from "../appwrite/config"
// import { useState } from 'react'
// import { useEffect } from 'react'
// import Container from '../components/container/Container'
// import PostCard from "../components/PostCard"


// function AllPosts() {
//   const [posts, setPosts] = useState([])

//   useEffect(() => {
//     appwriteService.getPosts([]).then((posts) => {
//       if (posts) {
//         setPosts(posts.documents)
//       }
//     })
//   }, [])
//   //TODO: add case for array length 0
//   return (
//     <div className='w-full py-8'>
//       <Container>
//         <div className="flex flex-wrap">
//           {posts.map((post) => (
//             <div className="p-2 w-1/4" key={post.$id}>
//               <PostCard {...post} />
//             </div>
//           ))}
//         </div>
//       </Container>
//     </div>
//   )
// }

// export default AllPosts
import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import Container from "../components/container/container";
import PostCard from "../components/PostCard";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await appwriteService.getPosts([]);
        if (res) {
          setPosts(res.documents);
        }
      } catch (error) {
        console.log("ALL POSTS ERROR:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No posts found 😶
          </div>
        ) : (
          <div className="flex flex-wrap">
            {posts.map((post) => (
              <div
                className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                key={post.$id}
              >
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;
