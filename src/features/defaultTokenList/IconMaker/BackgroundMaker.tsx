import Checkbox from "app/components/Checkbox";
import { createRef, useCallback, useEffect, useState } from "react";
import { ChromePicker } from "react-color";

function adjust(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

export default function BackgroundMaker({ editorInstance, onBgSet }) {
  const canvasRef = createRef() as any;
  const [bgType, setBgType] = useState<"solid" | "linear" | "radial">("radial");
  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (canvasRef.current && color) {
      const ctx = canvasRef.current.getContext("2d");
      if (bgType !== "solid") {
        let grd;
        if (bgType === "radial") {
          grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 128);
        } else {
          grd = ctx.createLinearGradient(0, 0, 128, 128);
        }
        grd.addColorStop(0, color);
        grd.addColorStop(1, adjust(color, -100));

        ctx.fillStyle = grd;
      } else {
        ctx.fillStyle = color;
      }
      ctx.fillRect(0, 0, 128, 128);

      console.log(canvasRef.current.toDataURL());
      editorInstance
        ?.loadImageFromURL(canvasRef.current.toDataURL(), "bg")
        .then(() => onBgSet());
    }
    // eslint-disable-next-line
  }, [editorInstance, onBgSet, color, bgType]);

  return (
    <div className="flex flex-row space-x-4">
      <div className="flex flex-col">
        <div className="flex flex-row items-center space-x-2">
          <Checkbox
            checked={bgType === "solid"}
            set={() => setBgType("solid")}
          />
          <div>Solid</div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <Checkbox
            checked={bgType === "linear"}
            set={() => setBgType("linear")}
          />
          <div>Linear</div>
        </div>

        <div className="flex flex-row items-center space-x-2">
          <Checkbox
            checked={bgType === "radial"}
            set={() => setBgType("radial")}
          />
          <div>Radian</div>
        </div>
      </div>
      <div>
        <ChromePicker
          color={color}
          onChange={(color) => setColor(color.hex)}
          // onChangeComplete={onChangeComplete}
        />
      </div>

      <canvas ref={canvasRef} height={128} width={128} className="hidden" />
    </div>
  );
}
