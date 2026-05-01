using System;

using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;

namespace NARLLGenerator;

public static class Util
{
    public static async Task<MemoryStream> DownloadSheetAsync(string fileId)
    {
        var json = Environment.GetEnvironmentVariable("GOOGLE_CREDENTIALS");

        if (json == null)
            throw new Exception("Missing GOOGLE_CREDENTIALS");

        var credential = GoogleCredential.FromJson(json)
            .CreateScoped(DriveService.Scope.DriveReadonly);

        var service = new DriveService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "NARLLGenerator",
        });

        var request = service.Files.Export(
            fileId,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        var stream = new MemoryStream();
        await request.DownloadAsync(stream);

        stream.Position = 0;
        return stream;
    }

    public static string GetFeatureStatus(string hexa)
    {
        if (hexa == "90FFFF")
        {
            return "top";
        }
        else if (hexa == "FF0000")
        {
            return "featured";
        }
        else
        {
            return "";
        }
    }
}
