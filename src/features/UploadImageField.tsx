import {
  DocumentAddIcon,
  DocumentDownloadIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import Typography from "app/components/Typography";
import { classNames } from "app/functions";
import React, { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import Resizer from "react-image-file-resizer";

interface UploadImageField {
  editor: any;
}

const UploadImageField: FC<UploadImageField> = ({ editor }) => {
  const { register, watch, setValue } = useFormContext();
  const [logoId] = watch(["logoId"]);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (logoId) {
        try {
          await editor?.removeObject(logoId);
          setValue("logoId", logoId);
        } catch {}
      }

      Resizer.imageFileResizer(
        acceptedFiles[0],
        86,
        86,
        "PNG",
        100,
        0,
        (uri: any) =>
          editor?.addImageObject(uri).then(({ id }) => {
            setValue("logoUri", uri);
            setValue("logoId", id);
          }),
        "base64",
        86,
        86
      );
    },
    [editor, logoId, setValue]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: "image/svg+xml",
      maxFiles: 1,
    });

  return (
    <div
      {...getRootProps()}
      className={classNames(
        isDragActive ? "border border-purple" : "border-dashed border-dark-800",
        "flex justify-center px-6 pt-5 pb-6 border-2 rounded-md flex-grow"
      )}
    >
      <input {...register("logoId")} className="hidden" />
      <input {...register("logoUri")} className="hidden" />

      <div className="flex flex-col items-center space-y-1 text-center">
        {isDragReject ? (
          <ExclamationIcon width={48} />
        ) : isDragActive ? (
          <DocumentDownloadIcon width={48} />
        ) : (
          <DocumentAddIcon width={48} />
        )}
        <div className="flex text-sm text-gray-600">
          <Typography
            component={"label"}
            variant="sm"
            className={classNames(
              isDragActive ? "" : "text-purple",
              "outline-none relative cursor-pointer rounded-md font-medium hover:purple focus-within:outline-none"
            )}
          >
            <label
              htmlFor="file-upload"
              className="outline-none cursor-pointer"
            >
              {isDragReject
                ? "File is not supported"
                : isDragActive
                ? "Drop file to upload"
                : "Upload a SVG"}
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="outline-none sr-only"
              {...getInputProps()}
            />
          </Typography>
          {!isDragActive && <p className="pl-1">or drag and drop</p>}
        </div>
      </div>
    </div>
  );
};

export default UploadImageField;
