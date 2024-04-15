import fs from "fs/promises";
import path from "path";
import ExcelJS from "exceljs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_FILE_PATH = "profile_data.json";
const EXPORT_NAME = "profile_data.xlsx";

interface Person {
  name: string;
  status: string;
  attendances: { [key: string]: string };
  progresses: { [key: string]: string };
  assignments: { [key: string]: string };
}

async function readJSONFromFile(filePath: string): Promise<Person[]> {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const jsonData = await fs.readFile(fullPath, "utf8");
    return JSON.parse(jsonData);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    throw err;
  }
}

async function convertJSONToExcelWithSheets(jsonData: Person[]) {
  const workbook = new ExcelJS.Workbook();

  // Create sheet for name and status
  const infoSheet = workbook.addWorksheet("Info");
  infoSheet.addRow(["Name", "Status"]);
  jsonData.forEach((person) => {
    infoSheet.addRow([person.name, person.status]);
  });

  // Create sheet for attendances
  const attendancesSheet = workbook.addWorksheet("Attendances");
  attendancesSheet.addRow(["Name", ...Object.keys(jsonData[0].attendances)]);
  jsonData.forEach((person) => {
    const row = [person.name, ...Object.values(person.attendances)];
    attendancesSheet.addRow(row);
  });

  // Create sheet for progresses
  const progressesSheet = workbook.addWorksheet("Progresses");
  progressesSheet.addRow(["Name", ...Object.keys(jsonData[0].progresses)]);
  jsonData.forEach((person) => {
    const row = [person.name, ...Object.values(person.progresses)];
    progressesSheet.addRow(row);
  });

  // Create sheet for assignments
  const assignmentsSheet = workbook.addWorksheet("Assignments");
  assignmentsSheet.addRow(["Name", ...Object.keys(jsonData[0].assignments)]);
  jsonData.forEach((person) => {
    const row = [person.name, ...Object.values(person.assignments)];
    assignmentsSheet.addRow(row);
  });

  await workbook.xlsx.writeFile(EXPORT_NAME);
  console.log(`File saved: ${EXPORT_NAME}`);
}

readJSONFromFile(JSON_FILE_PATH)
  .then((jsonData) => {
    convertJSONToExcelWithSheets(jsonData);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
