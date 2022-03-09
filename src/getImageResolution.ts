export default async function getImageResolution(image: File): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(image);
    img.onload = function (this: any) {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: this.width, height: this.height });
    };
    img.src = objectUrl;
  });
}
