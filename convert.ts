import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_FILE_PATH = "profile_data.json";

async function readJSONFromFile(filePath: string) {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const jsonData = await fs.promises.readFile(fullPath, "utf8");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    throw err;
  }
}

async function convertJSONToExcel(jsonData: JSON[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Flatten the data and extract unique keys
  const flattenedData = jsonData.flatMap((person) =>
    Object.entries(person).flatMap(([key, value]) =>
      typeof value === "object"
        ? Object.entries(value).map(([subkey, subvalue]) => [
            `${key}.${subkey}`,
            subvalue,
          ])
        : [[key, value]]
    )
  );
  const uniqueKeys = [...new Set(flattenedData.map(([key]) => key))];

  // Add headers
  worksheet.addRow(uniqueKeys);

  // Add data rows
  jsonData.forEach((person: any) => {
    const rowData = uniqueKeys.map((key) => {
      const [parentKey, subkey] = key.split(".");
      const value = person[parentKey];
      return subkey ? value?.[subkey] : value;
    });
    worksheet.addRow(rowData);
  });

  const fileName = "profile_data.xlsx";
  await workbook.xlsx.writeFile(fileName);
  console.log(`File saved: ${fileName}`);
}

(async () => {
  readJSONFromFile(JSON_FILE_PATH)
    .then((jsonData) => {
      convertJSONToExcel(jsonData);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
})();
