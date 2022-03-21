import Form from "app/components/Form";
import Slider from "app/components/Slider";
import Typography from "app/components/Typography";
import React, { FC, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import Resizer from "react-image-file-resizer";

interface SizeSliderProps {
  editor: any;
}

const SizeSlider: FC<SizeSliderProps> = ({ editor }) => {
  const { setValue, watch } = useFormContext();
  const [logoId, imageFile] = watch(["logoId", "imageFile"]);

  const setImage = useCallback(
    async (val) => {
      if (logoId) {
        try {
          await editor?.removeObject(logoId);
          setValue("logoId", logoId);
        } catch {}
      }

      Resizer.imageFileResizer(
        imageFile,
        val,
        val,
        "PNG",
        100,
        0,
        (uri: any) =>
          editor?.addImageObject(uri).then(({ id }) => {
            setValue("logoUri", uri);
            setValue("logoId", id);
          }),
        "base64",
        0,
        0
      );

      setValue("imageSize", val);
    },
    [editor, imageFile, logoId, setValue]
  );

  return (
    <div className="flex flex-col">
      <Typography weight={700}>Logo size</Typography>
      <div className="flex gap-4">
        <div className="flex flex-col flex-grow mt-3">
          <Slider
            min={48}
            max={128}
            markFormatter={(val) => `${val}`}
            onChange={setImage}
          />
          <div>
            <Form.TextField
              name="imageSize"
              helperText="Enter background size in pixel value"
              placeholder="32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeSlider;
