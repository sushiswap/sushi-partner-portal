import { PlusIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useCallback } from "react";
import Dropzone from "react-dropzone";

const images = ["bg1.png", "bg2.png"];

export default function PresetBackgrounds({ editorInstance, onBgSet }) {
  const onBgDrop = useCallback(
    async (acceptedFiles) => {
      await editorInstance
        ?.loadImageFromFile(acceptedFiles[0], "bg")
        .then(() => editorInstance.resize({ width: 128, height: 128 }));

      await onBgSet();
    },
    [editorInstance, onBgSet]
  );
  
  return (
    <div className="flex flex-col">
      <div className="text-sm">Preset backgrounds</div>
      <div className="grid justify-center grid-cols-4 grid-rows-2 gap-1.5">
        {images.map((image) => (
          <BackgroundItem
            key={image}
            image={image}
            setImage={(image) =>
              editorInstance
                ?.loadImageFromURL(`/backgrounds/${image}`, "bg")
                .then(onBgSet)
            }
          />
        ))}
        <Dropzone onDrop={onBgDrop} accept="image/*" maxFiles={1}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                className="flex items-center justify-center bg-gray-500 cursor-pointer w-11 h-11 rounded-xl"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusIcon width={24} />
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

function BackgroundItem({
  image,
  setImage,
}: {
  image: string;
  setImage: Function;
}) {
  return (
    <div className="cursor-pointer" onClick={() => setImage(image)}>
      <Image
        height={44}
        width={44}
        alt="bg"
        src={`/backgrounds/${image}`}
        className="border border-gray-900 rounded-xl"
      />
    </div>
  );
}
