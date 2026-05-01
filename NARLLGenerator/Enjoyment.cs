using System;
using OfficeOpenXml;

namespace NARLLGenerator;

public static class Enjoyment
{
    public static Dictionary<string, double> GetEnjoymentMappings(MemoryStream file)
    {
        ExcelPackage.License.SetNonCommercialPersonal("goop");
        using var package = new ExcelPackage(file);

        var mainSheet = package.Workbook.Worksheets["Ratings"];

        int rows = mainSheet.Dimension.Rows;
        int columns = mainSheet.Dimension.Columns;

        int averageRow = -1;

        for (int r = 1; r <= rows; r++)
        {
            for (int c = 1; c <= columns; c++)
            {
                var val = mainSheet.Cells[r, c].Text?.Trim().ToLower();
                if (val == "average")
                {
                    averageRow = r;
                    break;
                }
            }
            if (averageRow != -1) break;
        }

        if (averageRow == -1)
            throw new Exception("Average row not found");

        var enjoymentMappings = new Dictionary<string, double>();

        for (int c = 1; c <= columns; c++)
        {
            string key = mainSheet.Cells[2, c].Text;
            string valueText = mainSheet.Cells[averageRow, c].Text;

            if (string.IsNullOrWhiteSpace(key)) continue;
            if (double.TryParse(valueText, out double value))
            {
                enjoymentMappings[key] = value;
            }
        }
        
        return enjoymentMappings;

    }
}
