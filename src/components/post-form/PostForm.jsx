// import React, {useCallback} from "react";
// import {useForm} from "react-hook-form"
// import Button from "../Button"
// import Input from "../Input"
// import RTE from "../RTE"
// import Select from "../Select"
// import appwriteSerice from "../../appwrite/config"
// import {useSelector } from "react-redux"
// import {useNavigate} from "react-router-dom"


// export default function PostForm({post}){
//     const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
//         defaultValues: {
//             title: post?.title || "",
//             slug: post?.slug || "",
//             content: post?.content || "",
//             status: post?.status || "active"
//         }
//     })

//     const navigate = useNavigate()
//     const userData = useSelector((state) => state.auth.userData) // this hook useSelector() is use to extract the data form redux store.
//  //here the error arise due to submit is async so we have to apply try and catch for showing what is real problem.
//     const submit = async (data) => {
//         try {
//             console.log("SUBMIT DATA:", data)

//             if (post) {
//             const file = data.image[0]
//                 ? await appwriteSerice.uploadFile(data.image[0])
//                 : null

//             if (file) {
//                 appwriteSerice.deleteFile(post.featuredImage)
//             }

//             const dbPost = await appwriteSerice.updatePost(post.$id, {
//                 ...data,
//                 featuredImage: file ? file.$id : undefined,
//             })

//             if (dbPost) {
//                 navigate(`/post/${dbPost.$id}`)
//             }
//             } else {
//             const file = await appwriteSerice.uploadFile(data.image[0])

//             if (file) {
//                 data.featuredImage = file.$id
//                 const dbPost = await appwriteSerice.createPost({
//                 ...data,
//                 userId: userData.$id,
//                 })

//                 if (dbPost) {
//                 navigate(`/post/${dbPost.$id}`)
//                 }
//             }
//             }
//         } catch (error) {
//             console.log("POST SUBMIT ERROR:", error)
//             alert(error?.message || "Post creation failed")
//         }
//     }


//     const slugTransform = useCallback((value) => { // high level concept this use for handle the slug/url.
//         if(value && typeof value === "string") return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, '-')
//         .replace(/\s/g, "-")
//     }, [])

//     React.useEffect(() => {
//         // eslint-disable-next-line react-hooks/incompatible-library
//         watch((value, {name}) => {
//             if (name === "title") {
//                 setValue("slug", slugTransform(value.title), {shouldValidate: true})
//             }
//         })
//     }, [watch, slugTransform, setValue])
//     // from here all features implemented.
//     return (
//         <form onSubmit={handleSubmit(submit)}
//         className="flex flex-wrap"
//         >
//             <div className="w-2/3 px-2">
//                 <Input
//                 label="Title"
//                 placeholder="Title"
//                 className="mb-4"
//                 {...register("title", {required: true})}
//                 />
//                 <Input
//                 label="Slug :"
//                 placeholder="Slug"
//                 className="mb-4"
//                 {...register("slug", {required: true})}
//                 onInput={(e) => {
//                     setValue("slug", slugTransform(e.currentTarget.value), {shouldValidate: true})
//                 }}
//                 />
//                 <RTE
//                 label="Content: "
//                 name="content"
//                 control={control}
//                 defaultValue={getValues("content")}
//                 />
//             </div>
//             <div className="w-1/3 px-2 mt-2">
//                 <Input
//                 label="Featured Image"
//                 type="file"
//                 className="mb-2 mt-1.5"
//                 accept="image/png, image/jpg, image/jpeg"
//                 {...register("image", {required: !post})}
//                 />
//                 {post && (
//                     <div className="w-full mb-4">
//                         <img src={appwriteSerice.getFilePreview(post.featuredImage)} alt={post.title}
//                         className="rounded-lg"
//                         />

//                     </div>
//                 )}
//                 <div className="mt-0.5">
//                     <Select
//                     options={["active", "inactive"]}
//                     label="Status"
//                     className="mb-4 mt-1.5"
//                     {...register("status", {required: true})}
//                     />
//                 </div>
//                 <Button
//                 type="submit"
//                 bgColor={post ? "bg-green-500": undefined}
//                 className="w-full"
//                 >{post ? "Update": "Submit"}</Button>
//             </div>
//         </form>

//         // this is used for check--->
//         // <form
//         //     onSubmit={(e) => {
//         //         e.preventDefault()
//         //         console.log("FORM SUBMITTED ✅")
//         //         handleSubmit(submit)(e)
//         //     }}
//         //     className="flex flex-wrap">
//         //     <Button
//         //         type="submit"
//         //         bgColor={post ? "bg-green-500": undefined}
//         //         className="w-full"
//         //         >{post ? "Update": "Submit"}</Button>
//         // </form>

//     )
// }
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import appwriteSerice from "../../appwrite/config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const existingImageId = post?.featureImg || post?.featuredImage || "";
  const [error, setError] = React.useState("");

  // ✅ Slug transform function
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    return "";
  }, []);

  // ✅ auto slug update when title changes
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // ✅ Submit handler
  const submit = async (data) => {
    setError("");

    try {
      console.log("SUBMIT DATA:", data);
      console.log("USER DATA:", userData);

      // ✅ must be logged in
      if (!userData?.$id) {
        setError("Please login first");
        return;
      }

      const imageFile = data?.image?.[0]; // ✅ safe

      // ✅ UPDATE POST
      if (post) {
        const file = imageFile
          ? await appwriteSerice.uploadFile(imageFile, userData.$id)
          : null;
        const imageId = file?.$id || existingImageId;

        if (file && existingImageId) {
          // delete old image
          await appwriteSerice.deleteFile(existingImageId);
        }

        const dbPost = await appwriteSerice.updatePost(post.$id, {
          title: data.title,
          content: data.content,
          status: data.status,
          featuredImage: imageId,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
          return;
        }

        throw new Error("Post update failed. Check Appwrite database and storage permissions.");
      }

      // ✅ CREATE POST
      else {
        if (!imageFile) {
          setError("Please select an image");
          return;
        }

        const file = await appwriteSerice.uploadFile(imageFile, userData.$id);

        if (!file?.$id) {
          throw new Error("Image upload failed. Check Appwrite bucket permissions.");
        }

        const dbPost = await appwriteSerice.createPost({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage: file.$id,
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
          return;
        }

        await appwriteSerice.deleteFile(file.$id);
        throw new Error("Post creation failed. Check Appwrite collection permissions.");
      }
    } catch (error) {
      console.log("POST SUBMIT ERROR:", error);
      setError(error?.message || "Post save failed");
    }
  };

  const handleInvalidSubmit = () => {
    setError(
      post
        ? "Please fill all required fields."
        : "Please fill all required fields and select an image."
    );
  };

  return (
    <form onSubmit={handleSubmit(submit, handleInvalidSubmit)} className="flex flex-wrap">
      {/* ✅ Left side */}
      <div className="w-2/3 px-2">
        <Input
          label="Title"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />

        <RTE
          label="Content: "
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* ✅ Right side */}
      <div className="w-1/3 px-2 mt-2">
        <Input
          label="Featured Image"
          type="file"
          className="mb-2 mt-1.5"
          accept="image/png, image/jpg, image/jpeg"
          {...register("image", { required: !post })}
        />

        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteSerice.getFilePreview(existingImageId)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <div className="mt-0.5">
          <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4 mt-1.5"
            {...register("status", { required: true })}
          />
        </div>

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : post ? "Update" : "Submit"}
        </Button>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
