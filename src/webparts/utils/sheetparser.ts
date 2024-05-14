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

  // Checking file extension
  //const extension = inputFile.type;
  //const extension = path.extname(inputFile).toLowerCase();

  const name = inputFile.name;
  const lastDot = name.lastIndexOf(".");

  //const fileName = name.substring(0, lastDot);
  const extension = name.substring(lastDot + 1);

  if (extension === "xlsx" || extension === "xls") {
    const data = await inputFile.arrayBuffer();
    const workbook = XLSX.read(data, {
      type: "buffer",
      raw: true,
      cellNF: true,
    });
    // Read the Excel file
    /*     const workbook = XLSX.read(inputFile, {
      type: "file",
      raw: true,
      cellNF: true,
    }); */

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      const range = worksheet["!ref"];

      if (!range) {
        response.success = false;
        response.errors.push(`Worksheet: ${sheetName}`);
        response.errors.push(`Worksheet ${sheetName} is empty.`);
        return;
      }

      response.errors.push(`Worksheet: ${sheetName}`);

      const sheetSpec = specifications.sheets.find((spec) => {
        return (
          spec.name &&
          spec.name.toLowerCase().trim() === sheetName.toLowerCase().trim()
        );
      });

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
          //* detail where the column should be, if exists in the spec
          // find in sheetSpec.columns ->
          // does columnSpec exist? if yes, print which order it should be
          // if no, print 'columnSpec does not exist for columnName'

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

          if (!cellValue) return;

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

      if (!range) {
        response.success = false;
        response.errors.push(`Worksheet: ${sheetName}`);
        response.errors.push(`Worksheet ${sheetName} is empty.`);
        return;
      }

      response.errors.push(`Worksheet: ${sheetName}`);

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
