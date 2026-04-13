using System;

namespace NARLLGenerator;

public static class Util
{
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
