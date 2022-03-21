import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useFormContext } from "react-hook-form";
import useDebouncy from "use-debouncy/lib/effect";

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

export default function BackgroundMaker({ editor, onBgSet }) {
  const { setValue, watch } = useFormContext();
  const colorValue = watch("background");

  const canvasRef = useRef<HTMLCanvasElement>();
  const [color, setColor] = useState<string>();

  useDebouncy(() => setValue("background", color), 200, [color]);

  useEffect(() => {
    if (canvasRef.current && color) {
      const ctx = canvasRef.current.getContext("2d");
      const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 128);
      grd.addColorStop(0, color);
      grd.addColorStop(1, adjust(color, -100));

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, 128, 128);

      editor
        ?.loadImageFromURL(canvasRef.current.toDataURL(), "bg")
        .then(() => onBgSet());
    }
  }, [canvasRef, editor, onBgSet, color]);

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
      setColor(colorValue);
    } else {
      setColor("#000000");
    }
  }, [colorValue]);

  return (
    <div className="flex px-1 w-full relative">
      <HexColorPicker color={color} onChange={setColor} />
      <canvas ref={canvasRef} height={128} width={128} className="hidden" />
    </div>
  );
}
