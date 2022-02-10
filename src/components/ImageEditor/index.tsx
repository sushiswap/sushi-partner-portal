import dynamic from "next/dynamic";
import React from "react";

const ImageEditorDynamic = dynamic(() => import("./ImageEditor"), {
  ssr: false,
});

export default function ImageEditor(props) {
  return <ImageEditorDynamic {...props} />;
}
