import React from 'react';
import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

function RTE({ name, control, label, defaultValue = "" }) {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY || "yn26qm8sqp9eu6gl8kaghzglbrfrlppad4pc0zppb5i9orqm";

  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
        <Controller
          name={name || "content"}
          control={control}
          render={({ field: { onChange } }) => (
            <Editor
              apiKey={apiKey}
              initialValue={defaultValue}
              init={{
                branding: false,
                height: 420,
                menubar: true,
                skin: "oxide-dark",
                content_css: "dark",
                plugins: [
                  "image",
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright | bullist numlist | link image media | removeformat | fullscreen code",
                content_style:
                  "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; color: #e5e7eb; background: #0c0a1f; line-height: 1.6; }",
              }}
              onEditorChange={onChange}
            />
          )}
        />
      </div>
    </div>
  );
}

export default RTE;
