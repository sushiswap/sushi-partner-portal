import HeadlessUiModal from "app/components/Modal/HeadlessUIModal";
import { PlusIcon } from "@heroicons/react/outline";
import Button from "app/components/Button";
import Checkbox from "app/components/Checkbox";
import ImageEditor from "app/components/ImageEditor";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChromePicker, SketchPicker } from "react-color";
import Dropzone from "react-dropzone";
import Resizer from "react-image-file-resizer";
import PresetBackgrounds from "./IconMakerModal/PresetBackgrounds";
import BackgroundMaker from "./IconMakerModal/BackgroundMaker";

export default function IconMakerModal({ isOpen, close, setImage }) {
  const [logoId, setLogoId] = useState<number>();
  const [logoUri, setLogoUri] = useState<string>();
  const [editorInstance, setEditorInstance] = useState<any>();

  const onBgSet = useCallback(async () => {
    await editorInstance
      ?.addImageObject(logoUri)
      .then(({ id }) => setLogoId(id))
      .then(() => editorInstance.discardSelection());
  }, [editorInstance, logoUri]);

  const onIconDrop = useCallback(
    async (acceptedFiles) => {
      if (logoId)
        try {
          await editorInstance?.removeObject(logoId);
          setLogoId(undefined);
        } catch {}

      Resizer.imageFileResizer(
        acceptedFiles[0],
        64,
        64,
        "PNG",
        100,
        0,
        (uri: any) =>
          editorInstance?.addImageObject(uri).then(({ id }) => {
            setLogoUri(uri);
            setLogoId(id);
          }),
        "base64",
        64,
        64
      );
    },
    [editorInstance, logoId]
  );

  const onCenter = useCallback(async () => {
    if (!logoId) return;

    await editorInstance?.setObjectPosition(logoId, {
      x: 64,
      y: 64,
      originX: "center",
      originY: "center",
    });
  }, [editorInstance, logoId]);

  useEffect(() => {
    if (editorInstance)
      editorInstance.loadImageFromURL("/backgrounds/bg1.png", "bg");
  }, [editorInstance]);

  return (
    <HeadlessUiModal.Controlled isOpen={isOpen} onDismiss={close}>
      <HeadlessUiModal.Header header="Icon Maker" onClose={close} />
      <div className="flex flex-col w-full space-y-2">
        <div className="flex flex-row items-center justify-between w-full">
          <PresetBackgrounds
            editorInstance={editorInstance}
            onBgSet={onBgSet}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="text-sm">Upload icon</div>
              <Dropzone onDrop={onIconDrop} accept="image/*" maxFiles={1}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div
                      className="flex items-center justify-center w-16 h-16 bg-gray-500 cursor-pointer rounded-xl"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <PlusIcon width={32} />
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <Button
              size="xs"
              color="purple"
              variant="outlined"
              className="w-16"
              onClick={onCenter}
            >
              Center
            </Button>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <BackgroundMaker editorInstance={editorInstance} onBgSet={onBgSet} />
          <div className="flex flex-col justify-between">
            <ImageEditor setInstance={setEditorInstance} />
            <Button
              color="purple"
              variant="outlined"
              onClick={() => {
                setImage(editorInstance?.toDataURL());
                close();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </HeadlessUiModal.Controlled>
  );
}
