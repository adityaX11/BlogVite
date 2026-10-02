import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import RTE from "../RTE";
import Select from "../Select";
import appwriteService from "../../appwrite/config";
import { postService, buildPostFormData } from "../../services/post.service";
import { apiService } from "../../services/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const isMongoPost = Boolean(post?._id);
  const existingImageUrl =
    post?.featuredImage?.url ||
    (typeof post?.featuredImage === "string" && post.featuredImage.startsWith("http")
      ? post.featuredImage
      : "");
  const existingAppwriteImageId =
    !isMongoPost ? post?.featureImg || post?.featuredImage || "" : "";

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
      caption: post?.featuredImage?.caption || "",
      tags: post?.tags ? post.tags.join(", ") : "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = useState("");

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s+/g, "-");
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title" && !post) {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue, post]);

  const submit = async (data) => {
    setError("");

    try {
      const hasJwt = Boolean(apiService.getToken());
      const imageFile = data?.image?.[0];

      // Parse tags
      const tagsArray = data.tags
        ? data.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];

      // ── Path A: Using MongoDB backend ─────────────────────
      if (hasJwt || isMongoPost) {
        const formData = buildPostFormData({
          title: data.title,
          slug: data.slug,
          content: data.content,
          caption: data.caption,
          status: data.status,
          tags: tagsArray,
          imageFile: imageFile,
        });

        if (post) {
          // Update
          const updated = await postService.updatePost(post.slug, formData);
          if (updated && !updated.message) {
            navigate(`/post/${updated.slug}`);
            return;
          }
          throw new Error(updated.message || "Failed to update post");
        } else {
          // Create
          if (!imageFile) {
            setError("Please select a featured image");
            return;
          }
          const created = await postService.createPost(formData);
          if (created && !created.message) {
            navigate(`/post/${created.slug}`);
            return;
          }
          throw new Error(created.message || "Failed to create post");
        }
      }

      // ── Path B: Fallback to Appwrite ──────────────────────
      if (!userData?.$id) {
        setError("Please log in to publish a post");
        return;
      }

      if (post) {
        const file = imageFile
          ? await appwriteService.uploadFile(imageFile, userData.$id)
          : null;
        const imageId = file?.$id || existingAppwriteImageId;

        if (file && existingAppwriteImageId) {
          await appwriteService.deleteFile(existingAppwriteImageId);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          title: data.title,
          content: data.content,
          status: data.status,
          featuredImage: imageId,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
          return;
        }
        throw new Error("Appwrite update failed");
      } else {
        if (!imageFile) {
          setError("Please select a featured image");
          return;
        }

        const file = await appwriteService.uploadFile(imageFile, userData.$id);
        if (!file?.$id) throw new Error("Image upload to Appwrite failed");

        const dbPost = await appwriteService.createPost({
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
        throw new Error("Appwrite post creation failed");
      }
    } catch (err) {
      console.error("Post submit error:", err);
      setError(err?.message || "Failed to save post");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-wrap max-w-6xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl text-white"
    >
      {/* ── Left Column ── */}
      <div className="w-full lg:w-2/3 lg:pr-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Post Title
          </label>
          <input
            type="text"
            placeholder="e.g. Building with React 19 & MongoDB"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg font-semibold"
            {...register("title", { required: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Slug (URL)
          </label>
          <input
            type="text"
            placeholder="building-with-react-19-mongodb"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm transition-all"
            {...register("slug", { required: true })}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Content
          </label>
          <RTE
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>
      </div>

      {/* ── Right Column ── */}
      <div className="w-full lg:w-1/3 lg:pl-6 mt-6 lg:mt-0 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/webp"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            {...register("image", { required: !post })}
          />
        </div>

        {/* Image Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Image Caption
          </label>
          <input
            type="text"
            placeholder="e.g. Photo by John Doe on Unsplash"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            {...register("caption")}
          />
        </div>

        {/* Existing Image Preview */}
        {post && (existingImageUrl || existingAppwriteImageId) && (
          <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
            <img
              src={
                existingImageUrl ||
                appwriteService.getFilePreview(existingAppwriteImageId)
              }
              alt={post.title}
              className="w-full h-36 object-cover"
            />
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="react, mongodb, threejs"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            {...register("tags")}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Publication Status
          </label>
          <select
            className="w-full bg-indigo-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            {...register("status", { required: true })}
          >
            <option value="active">Active (Published)</option>
            <option value="inactive">Inactive (Draft)</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading to Cloudinary & Saving…
            </span>
          ) : post ? (
            "Update Post"
          ) : (
            "Publish Post"
          )}
        </button>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}
      </div>
    </form>
  );
}
