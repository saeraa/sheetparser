import * as XLSX from "@e965/xlsx";

interface IColumnSpec {
  name: string;
  type: string; // 'string', 'number', or a regex pattern
}

interface ISheetSpec {
  name?: string;
  columns: IColumnSpec[];
}

interface IJsonSpec {
  fileName?: string;
  sheets: ISheetSpec[];
}

interface IResponse {
  file: File | undefined;
  success: boolean;
  errors: string[];
}

// Check if a value matches the specified type
function isValidType(value: string | number, type: string): boolean {
  if (type === "string") {
    return typeof value === "string";
  } else if (type === "number") {
    return !isNaN(+value);
  } else if (
    typeof value === "string" &&
    type.startsWith("/") &&
    type.endsWith("/")
  ) {
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    const regex = new RegExp(type.slice(1, -1));
    return regex.test(value);
  } else {
    console.error(`Invalid type specified: ${type}`);
    return false;
  }
}

// Processing the file
async function processFile(
  inputFile: File,
  specifications: IJsonSpec
): Promise<IResponse> {
  const response: IResponse = {
    file: inputFile,
    success: true,
    errors: [],
  };

  const name = inputFile.name;
  const lastDot = name.lastIndexOf(".");

  const fileName = name.substring(0, lastDot);
  const extension = name.substring(lastDot + 1);

  if (specifications.fileName) {
    let regex;
    try {
      //eslint-disable-next-line @rushstack/security/no-unsafe-regexp
      regex = new RegExp(specifications.fileName.slice(1, -1));
      if (!regex.test(fileName)) {
        response.success = false;
        response.errors.push(
          `Mismatch in file name: Expected fileName in the format "${specifications.fileName}", but found "${fileName}"`
        );
      }
    } catch (error) {
      response.success = false;
      response.errors.push(
        `Invalid regular expression for fileName: ${error.message}`
      );
    }
  }

  if (extension === "xlsx" || extension === "xls") {
    const data = await inputFile.arrayBuffer();
    const workbook = XLSX.read(data, {
      type: "buffer",
      raw: true,
      cellNF: true,
      cellDates: true,
      dateNF: "yyyy-mm-dd",
    });

    workbook.SheetNames.forEach((sheetName, sheetIndex) => {
      const worksheet = workbook.Sheets[sheetName];

      const range = worksheet["!ref"];

      const sheetSpec =
        specifications.sheets.find((spec) => {
          return (
            (spec.name &&
              spec.name.toLowerCase().trim() ===
                sheetName.toLowerCase().trim()) ||
            spec.name === ""
          );
        }) || specifications.sheets[sheetIndex];

      if (!sheetSpec || !sheetSpec.columns || sheetSpec.columns.length === 0) {
        // Skip the sheet if there are no specified columns
        response.errors.push(
          `Worksheet: ${sheetName}: Skipping sheet - No columns specified.`
        );
        return;
      }

      if (!range) {
        // Throw an error if the sheet is empty
        response.success = false;
        response.errors.push(`Worksheet: ${sheetName}`);
        response.errors.push(`Worksheet ${sheetName} is empty.`);
        return;
      }

      response.errors.push(`Worksheet: ${sheetName}`);

      // Get the column range
      const firstCell = range.split(":")[0];
      const firstCol = firstCell.replace(/[^a-zA-Z]/g, "");

      // Loop through each column
      for (let colIndex = 0; colIndex < sheetSpec.columns.length; colIndex++) {
        const col = String.fromCharCode(firstCol.charCodeAt(0) + colIndex);
        const columnSpec = sheetSpec.columns[colIndex];

        // Get the first cell in the column
        const cellAddress = `${col}${firstCell.replace(/\D/g, "")}`;
        const cellValue = worksheet[cellAddress]
          ? worksheet[cellAddress].v ?? worksheet[cellAddress].z
          : undefined;

        // Check if cell value matches column name
        if (
          cellValue !== undefined &&
          cellValue.toLowerCase() !== columnSpec.name.toLowerCase()
        ) {
          response.success = false;

          const cellValueLowerCase = cellValue.toLowerCase();
          const columnMatch = sheetSpec.columns.findIndex(
            (col) => col.name.toLowerCase() === cellValueLowerCase
          );
          if (columnMatch !== -1) {
            response.errors.push(
              `Mismatch in column ${col}: Expected "${
                columnSpec.name
              }", but found "${cellValue}" at ${cellAddress}. 
              Column ${columnSpec.name} should be at position ${
                columnMatch + 1
              }`
            );
          } else {
            response.errors.push(
              `Mismatch in column ${col}: Expected "${columnSpec.name}", but found "${cellValue}" at ${cellAddress}`
            );
          }

          continue; // Skip further validation for this column
        }

        // Check the type of each cell value in the column
        for (
          let rowIndex = 2;
          rowIndex <= parseInt(range.split(":")[1].replace(/\D/g, ""));
          rowIndex++
        ) {
          const cellAddress = `${col}${rowIndex}`;
          const cellValue = worksheet[cellAddress]
            ? worksheet[cellAddress].w
            : undefined;

          if (!cellValue) continue;

          if (!isValidType(cellValue, columnSpec.type)) {
            response.success = false;

            response.errors.push(
              `Invalid data type in column ${col}, row ${rowIndex}: Expected type "${
                columnSpec.type
              }", but found "${typeof cellValue}" (${
                worksheet[cellAddress].w
              }) at ${cellAddress}`
            );
          }
        }
      }
    });
  } else if (extension === "csv") {
    const data = await inputFile.arrayBuffer();
    const workbook = XLSX.read(data, { raw: true, cellNF: true });

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      const range = worksheet["!ref"];
      
      response.errors.push(`Worksheet: ${sheetName}`);

      if (!range) {
        response.success = false;
        response.errors.push(`Worksheet ${sheetName} is empty.`);
        return;
      }

      const sheetSpec = specifications.sheets[0];

      if (!sheetSpec) {
        response.success = false;
        response.errors.push(
          `No specifications found for worksheet: ${sheetName}`
        );
        return;
      }

      // Get the column range
      const firstCell = range.split(":")[0];
      const firstCol = firstCell.replace(/[^a-zA-Z]/g, "");

      // Loop through each column
      for (let colIndex = 0; colIndex < sheetSpec.columns.length; colIndex++) {
        const col = String.fromCharCode(firstCol.charCodeAt(0) + colIndex);
        const columnSpec = sheetSpec.columns[colIndex];

        // Get the first cell in the column
        const cellAddress = `${col}${firstCell.replace(/\D/g, "")}`;
        const cellValue = worksheet[cellAddress]
          ? worksheet[cellAddress].v ?? worksheet[cellAddress].z
          : undefined;

        // Check if cell value matches column name
        if (
          cellValue !== undefined &&
          cellValue.toLowerCase() !== columnSpec.name.toLowerCase()
        ) {
          response.success = false;

          const cellValueLowerCase = cellValue.toLowerCase();
          const columnMatch = sheetSpec.columns.findIndex(
            (col) => col.name.toLowerCase() === cellValueLowerCase
          );
          if (columnMatch !== -1) {
            response.errors.push(
              `Mismatch in column ${col}: Expected "${
                columnSpec.name
              }", but found "${cellValue}" at ${cellAddress}. 
              Column ${columnSpec.name} should be at position ${
                columnMatch + 1
              }`
            );
          } else {
            response.errors.push(
              `Mismatch in column ${col}: Expected "${columnSpec.name}", but found "${cellValue}" at ${cellAddress}`
            );
          }
          continue; // Skip further validation for this column
        }

        // Check the type of each cell value in the column
        for (
          let rowIndex = 2;
          rowIndex <= parseInt(range.split(":")[1].replace(/\D/g, ""));
          rowIndex++
        ) {
          const cellAddress = `${col}${rowIndex}`;
          const cellValue = worksheet[cellAddress]
            ? worksheet[cellAddress].v
            : undefined;

          if (!cellValue) return;

          if (!isValidType(cellValue, columnSpec.type)) {
            response.success = false;
            response.errors.push(
              `Invalid data type in column ${col}, row ${rowIndex}: Expected type "${
                columnSpec.type
              }", but found "${typeof cellValue}" (${cellValue}) at ${cellAddress}`
            );
          }
        }
      }
    });
  } else {
    response.success = false;
    response.errors.push(
      "Unsupported file format. Only .xlsx and .csv are supported."
    );
  }

  return response;
}

export { IJsonSpec, IResponse };
export default processFile;
