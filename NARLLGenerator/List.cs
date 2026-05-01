using System;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace NARLLGenerator;

public static class List
{
    public static Level ProcessRowMAIN(ExcelWorksheet sheet, int row)
    {
        var name = sheet.Cells[row, 2].Text;
        if (string.IsNullOrWhiteSpace(name)) return null;

        var idText = sheet.Cells[row, 3].Text;
        if (!int.TryParse(idText, out var id)) return null;

        var length = sheet.Cells[row, 4].Text;
        var tags = sheet.Cells[row, 5].Text;
        var author = sheet.Cells[row, 6].Text;
        var verifier = sheet.Cells[row, 7].Text;

        var link = sheet.Cells[row, 2].Hyperlink?.ToString();
        if (link == null)
        {
            link = "https://www.youtube.com/watch?v=JLUHNV2zcV4";
        }

        var victorsRaw = sheet.Cells[row, 10].Text;

        var records = victorsRaw
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(v => new Record
            {
                user = v.Trim(),
                link = "",
                percent = 100,
                hz = 0
            })
            .ToList();
        
        var creators = author
            .Split(',', StringSplitOptions.TrimEntries).ToList();

        var notes = sheet.Cells[row, 11].Text;
        var nong = sheet.Cells[row, 12].Text;

        var feature = "";
        ExcelColor fillColor = sheet.Cells[row, 2].Style.Fill.BackgroundColor;
        if (fillColor.Rgb != null)
        {
            feature = Util.GetFeatureStatus(fillColor.Rgb.Substring(2));
        }

        return new Level
        {
            id = id,
            name = name,
            featured = feature,
            length = length,
            author = author,
            tags = tags,
            creators = creators,
            verifier = verifier,
            verification = link,
            records = records,
            notes = notes,
            nong = nong
        };
    }

    public static Level ProcessRowLEGACY(ExcelWorksheet sheet, int row)
    {
        var name = sheet.Cells[row, 2].Text;
        if (string.IsNullOrWhiteSpace(name)) return null;

        var idText = sheet.Cells[row, 3].Text;
        if (!int.TryParse(idText, out var id)) return null;

        var author = sheet.Cells[row, 4].Text;
        var verifier = sheet.Cells[row, 5].Text;

        var link = sheet.Cells[row, 2].Hyperlink?.ToString();
        if (link == null)
        {
            link = "https://www.youtube.com/watch?v=JLUHNV2zcV4";
        }

        var victorsRaw = sheet.Cells[row, 7].Text;

        var records = victorsRaw
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(v => new Record
            {
                user = v.Trim(),
                link = "",
                percent = 100,
                hz = 0
            })
            .ToList();

        var notes = sheet.Cells[row, 8].Text;

        var creators = author
            .Split(',', StringSplitOptions.TrimEntries).ToList();

        var feature = "";
        ExcelColor fillColor = sheet.Cells[row, 2].Style.Fill.BackgroundColor;
        if (fillColor.Rgb != null)
        {
            feature = Util.GetFeatureStatus(fillColor.Rgb.Substring(2));
        }

        return new Level
        {
            id = id,
            name = name,
            featured = feature,
            length = "NA",
            author = author,
            tags = "NA",
            creators = creators,
            verifier = verifier,
            verification = link,
            records = records,
            notes = notes
        };
    }

    public static UnverifiedLevel ProcessRowUNVERIFIED(ExcelWorksheet sheet, int row)
    {
        var name = sheet.Cells[row, 1].Text;
        if (string.IsNullOrWhiteSpace(name)) return null;

        var idText = sheet.Cells[row, 2].Text;
        if (!int.TryParse(idText, out var id)) return null;
        
        var author = sheet.Cells[row, 3].Text;
        var verifier = sheet.Cells[row, 4].Text;

        var progress = sheet.Cells[row, 5].Text;

        return new UnverifiedLevel
        {
            name = name,
            id = id,
            author = author,
            verifier = verifier,
            progress = progress
        };
    }

}
