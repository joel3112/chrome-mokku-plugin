import { StoreSchema } from "./schema";

export const downloadJsonFile = (object: any, fileName: string) => {
  const jsonString = JSON.stringify(object, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);

  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const extractJsonFromFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result as string);
        const parsedData = StoreSchema.parse(jsonData);

        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read the file"));
    reader.readAsText(file);
  });
};
