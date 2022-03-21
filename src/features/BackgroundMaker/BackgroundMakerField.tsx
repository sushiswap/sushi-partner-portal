import Form from "app/components/Form";
import Typography from "app/components/Typography";
import React, { FC, useCallback } from "react";
import { useFormContext } from "react-hook-form";

import BackgroundMaker from "./BackgroundMaker";

interface BackgroundImageMakerField {
  editor: any;
}

const BackgroundImageMakerField: FC<BackgroundImageMakerField> = ({
  editor,
}) => {
  const { setValue, watch } = useFormContext();
  const [logoUri] = watch(["logoUri"]);

  const onBgSet = useCallback(async () => {
    if (editor && logoUri)
      await editor
        ?.addImageObject(logoUri)
        .then(({ id }) => setValue("logoId", id))
        .then(() => editor.discardSelection());
  }, [editor, logoUri, setValue]);

  return (
    <div className="flex flex-col">
      <Typography weight={700}>Background color</Typography>
      <div className="flex gap-4">
        <div className="flex flex-col flex-grow mt-3 gap-2">
          <BackgroundMaker editor={editor} onBgSet={onBgSet} />
          <div>
            <Form.TextField
              name="background"
              helperText="Enter background color in hex value"
              placeholder="#AABBCC"
              className="max-w-[204px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundImageMakerField;
