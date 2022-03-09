import { PlusIcon } from "@heroicons/react/outline";
import { PencilAltIcon } from "@heroicons/react/solid";
import Checkbox from "app/components/Checkbox";
import QuestionHelper from "app/components/QuestionHelper";
import { classNames } from "app/functions";
import getImageResolution from "app/functions/getImageResolution";
import toBase64 from "app/functions/toBase64";
import Image from "next/image";
import { useState } from "react";
import Dropzone from "react-dropzone";
import IconMakerModal from "./IconSelector/IconMakerModal";

export default function IconSelector({
  tokenIcon,
  setTokenIcon,
}: {
  tokenIcon: string;
  setTokenIcon: Function;
}) {
  const [uploadOwnImage, setUploadOwnImage] = useState(true);
  const [isEditorOpen, setEditorOpen] = useState(false);

  return (
    <div className="flex flex-row w-full space-x-4">
      <div className="flex flex-col space-y-2 whitespace-nowrap">
        <div className="flex flex-row items-center space-x-2">
          <Checkbox
            checked={uploadOwnImage}
            set={() => setUploadOwnImage(true)}
          />
          <div>Upload full image</div>
          <QuestionHelper text="Please make sure the image is 128x128" />
        </div>
        <div className="flex flex-row items-center space-x-2">
          <Checkbox
            checked={!uploadOwnImage}
            set={() => setUploadOwnImage(false)}
          />
          <div>Upload only logo</div>
        </div>
      </div>
      {uploadOwnImage ? (
        <div className="flex justify-end w-full">
          <Dropzone
            onDrop={async (files) => {
              const { width, height } = await getImageResolution(files[0]);
              if (width !== 128 || height !== 128) return;

              setTokenIcon(await toBase64(files[0]));
            }}
            accept="image/*"
            maxFiles={1}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div
                  className={classNames(
                    "flex items-center justify-center w-32 h-32 cursor-pointer rounded-xl",
                    !tokenIcon && "bg-gray-500"
                  )}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {!!tokenIcon ? (
                    <Image
                      className="rounded-xl"
                      alt="icon"
                      src={tokenIcon}
                      height={128}
                      width={128}
                    />
                  ) : (
                    <PlusIcon width={28} />
                  )}
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      ) : (
        <div className="flex justify-end w-full">
          <IconMakerModal
            isOpen={isEditorOpen}
            close={() => setEditorOpen(false)}
            setImage={(image: string) => setTokenIcon(image)}
          />
          <div
            className={classNames(
              "flex items-center justify-center w-32 h-32 cursor-pointer rounded-xl",
              !tokenIcon && "bg-gray-500"
            )}
            onClick={() => setEditorOpen(true)}
          >
            {!!tokenIcon ? (
              <Image
                className="rounded-xl"
                alt="icon"
                src={tokenIcon}
                height={128}
                width={128}
              />
            ) : (
              <PencilAltIcon width={28} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
