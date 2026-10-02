import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import RTE from "../RTE";
import { postService, buildPostFormData } from "../../services/post.service";
import { useNavigate } from "react-router-dom";

export default function PostForm({ post }) {
  const existingImageUrl =
    post?.featuredImage?.url ||
    (typeof post?.featuredImage === "string" && post.featuredImage.startsWith("http")
      ? post.featuredImage
      : "");

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
  const [error, setError] = useState("");
  const [localImagePreview, setLocalImagePreview] = useState(existingImageUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);

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

  // Handle local image file selection with preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLocalImagePreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setLocalImagePreview("");
  };

  const submit = async (data) => {
    setError("");

    try {
      if (!data.title?.trim()) {
        setError("Please provide a title");
        return;
      }

      // Parse tags
      const tagsArray = data.tags
        ? data.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];

      const formData = buildPostFormData({
        title: data.title.trim(),
        slug: data.slug?.trim() || "",
        content: data.content || "",
        caption: data.caption?.trim() || "",
        status: data.status || "active",
        tags: tagsArray,
        imageFile: selectedFile,
      });

      if (post) {
        // Update existing post
        const updated = await postService.updatePost(post.slug, formData);
        if (updated && !updated.message) {
          navigate(`/post/${updated.slug}`);
          return;
        }
        throw new Error(updated?.message || "Failed to update post");
      } else {
        // Create new post (only title is mandatory!)
        const created = await postService.createPost(formData);
        if (created && !created.message) {
          navigate(`/post/${created.slug}`);
          return;
        }
        throw new Error(created?.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Post submit error:", err);
      setError(err?.message || "Failed to save post. Please ensure you are signed in.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex flex-wrap max-w-6xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl text-white"
    >
      {/* ── Left Column ── */}
      <div className="w-full lg:w-2/3 lg:pr-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Story Title <span className="text-pink-400 font-bold">* (Mandatory)</span>
          </label>
          <input
            type="text"
            placeholder="Give your article an engaging title..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg font-semibold"
            {...register("title", { required: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            URL Slug <span className="text-gray-500 text-xs font-normal">(Auto-generated, optional)</span>
          </label>
          <input
            type="text"
            placeholder="my-first-article"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm transition-all"
            {...register("slug")}
            onInput={(e) => {
              setValue("slug", slugTransform(e.currentTarget.value), {
                shouldValidate: true,
              });
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Content / Story <span className="text-gray-500 text-xs font-normal">(Optional for quick notes)</span>
          </label>
          <RTE
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />
        </div>
      </div>

      {/* ── Right Column (Image & Publishing Controls) ── */}
      <div className="w-full lg:w-1/3 lg:pl-6 mt-6 lg:mt-0 space-y-5">
        {/* Image upload & customization */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
          <label className="block text-sm font-semibold text-gray-200">
            Featured Image & Caption <span className="text-gray-500 text-xs font-normal">(Optional)</span>
          </label>

          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/webp, image/gif"
            onChange={handleImageChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />

          {/* Interactive Image Preview with Remove option */}
          {localImagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/60 group">
              <img
                src={localImagePreview}
                alt="Preview"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1.5 text-xs shadow-md backdrop-blur-sm transition-all"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="w-full h-24 rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center text-xs text-gray-500">
              <span>🖼️ No image selected</span>
              <span className="text-[10px] text-gray-600">Max size 8MB (Cloudinary auto-optimized)</span>
            </div>
          )}

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Image Caption / Credit
            </label>
            <input
              type="text"
              placeholder="e.g. Photo by NASA on Unsplash"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              {...register("caption")}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="react, mongodb, thoughts"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            {...register("tags")}
          />
        </div>

        {/* Publication Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Status
          </label>
          <select
            className="w-full bg-[#120e29] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            {...register("status", { required: true })}
          >
            <option value="active">Active (Published)</option>
            <option value="inactive">Draft / Private</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving to MongoDB…
            </span>
          ) : post ? (
            "Update Story"
          ) : (
            "Publish Story"
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
