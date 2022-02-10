import React, { createRef, useEffect, useRef } from "react";
import ImageEditorImport from "@toast-ui/react-image-editor";

export default function ImageEditor({ setInstance }) {
  const ref = createRef<any>();

  useEffect(() => {
    if (ref.current) {
      setInstance(ref.current.getInstance());
    }
  }, [ref, setInstance]);

  return (
    <ImageEditorImport
      // @ts-ignore
      ref={ref}
      cssMaxHeight={128}
      cssMaxWidth={128}
      usageStatistics={false}
      includeUI={{
        uiSize: {
          width: "128px",
          height: "128px",
        },
        theme: {
          "loadButton.backgroundColor": "FFFFFF",
        },
        menu: [],
      }}
    />
  );
}
