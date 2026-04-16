// MADE BY SCRUFFIE BAKA >:333

using NARLLGenerator;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.IO;
using System.Text.Json;


async Task<MemoryStream> DownloadSheetAsync()
{
    using var client = new HttpClient();
    var url = "https://docs.google.com/spreadsheets/d/1gsfQKeiUm-mlEayo3e4FskkvuFJtIPjF_ad18j9q9XI/export?format=xlsx";
    var bytes = await client.GetByteArrayAsync(url);

    return new MemoryStream(bytes);
}

using var stream = await DownloadSheetAsync();

ExcelPackage.License.SetNonCommercialPersonal("goop");
using var package = new ExcelPackage(stream);

var dataDir = "data";
Directory.CreateDirectory("data");
Directory.CreateDirectory("dataextra");
Directory.CreateDirectory("dataextra/unverified");
foreach (var file in Directory.GetFiles(dataDir, "*.json"))
{
    if (Path.GetFileName(file) == "_editors.json") continue;
    File.Delete(file);
}
if (File.Exists("dataextra/creators.json"))
{
    File.Delete("dataextra/creators.json");
}
foreach (var file in Directory.GetFiles("dataextra/unverified", "*.json"))
{
    File.Delete(file);
}

var allLevels = new List<Level>();
var unverifiedLevels = new List<UnverifiedLevel>();
var features = new List<Level>();


var sheet1 = package.Workbook.Worksheets["NARLL"];
var sheet2 = package.Workbook.Worksheets["Legacy List"];
var sheet3 = package.Workbook.Worksheets["NARUL"];

for (int row = 3; row <= 52; row++)
{
    var level = List.ProcessRowMAIN(sheet1, row);
    if (level == null) continue;

    var json = JsonSerializer.Serialize(level, new JsonSerializerOptions
    {
        WriteIndented = true
    });

    File.WriteAllText($"data/{level.id.ToString()}.json", json);
    allLevels.Add(level);

    if(level.featured != "")
    {
        features.Add(level);
    }
}

for (int row = 3; row <= 18; row++)
{
    var level = List.ProcessRowLEGACY(sheet2, row);
    if (level == null) continue;

    var json = JsonSerializer.Serialize(level, new JsonSerializerOptions
    {
        WriteIndented = true
    });

    File.WriteAllText($"data/{level.id.ToString()}.json", json);
    allLevels.Add(level);

    if(level.featured != "")
    {
        features.Add(level);
    }
}

for (int row = 40; row > 0; row--)
{
    var level = List.ProcessRowUNVERIFIED(sheet3, row);
    if (level == null) continue;

    var json = JsonSerializer.Serialize(level, new JsonSerializerOptions
    {
        WriteIndented = true
    });

    File.WriteAllText($"dataextra/unverified/{level.id.ToString()}.json", json);
    unverifiedLevels.Add(level);
}

var nameList = allLevels.Select(l => l.id).ToList();
var listJson = JsonSerializer.Serialize(nameList, new JsonSerializerOptions
{
    WriteIndented = true
});

var unv_nameList = unverifiedLevels.Select(l => l.id).ToList();
var unv_listJson = JsonSerializer.Serialize(unv_nameList, new JsonSerializerOptions
{
    WriteIndented = true
});

File.WriteAllText("data/_list.json", listJson);
File.WriteAllText("dataextra/unverified/_list.json", unv_listJson);

List<Creator> creatorList = CreatorList.ProcessCreators(features);

File.WriteAllText(
    "dataextra/creators.json",
    JsonSerializer.Serialize(creatorList, new JsonSerializerOptions { WriteIndented = true })
);
