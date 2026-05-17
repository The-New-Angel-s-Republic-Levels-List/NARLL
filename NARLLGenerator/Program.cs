// MADE BY SCRUFFIE BAKA >:333

using NARLLGenerator;
using OfficeOpenXml;
using System.Text.Json;

using System.Globalization;
using System.Text;

using var stream = await Util.DownloadSheetAsync("1gsfQKeiUm-mlEayo3e4FskkvuFJtIPjF_ad18j9q9XI");

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

var stream2 = await Util.DownloadSheetAsync("1WKjdpJr67pCnjRGVtIWpUx3PE-P4PBHXglYcUxPFgPs");
Dictionary<string, double> enjoymentValues = Enjoyment.GetEnjoymentMappings(stream2);


for (int row = 3; row <= 100; row++)
{
    var level = List.ProcessRowMAIN(sheet1, row, enjoymentValues);
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

string CleanLevelName(string name)
{
    if (string.IsNullOrWhiteSpace(name))
        return name;

    var sb = new StringBuilder();

    foreach (char c in name)
    {
        var category = CharUnicodeInfo.GetUnicodeCategory(c);

        if (category == UnicodeCategory.OtherSymbol ||
            category == UnicodeCategory.Surrogate)
        {
            continue;
        }

        sb.Append(c);
    }
    
    string cleaned = sb.ToString();
    cleaned = string.Join(" ", cleaned.Split(' ', StringSplitOptions.RemoveEmptyEntries));

    return cleaned.Trim();
}

var idMappings = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

foreach (var level in allLevels)
{
    string cleanedName = CleanLevelName(level.name);

    if (!string.IsNullOrWhiteSpace(cleanedName) &&
        !idMappings.ContainsKey(cleanedName))
    {
        idMappings[cleanedName] = level.id;
    }
}

var idMappingsJson = JsonSerializer.Serialize(idMappings, new JsonSerializerOptions
{
    WriteIndented = true
});

File.WriteAllText("dataextra/idmappings.json", idMappingsJson);
