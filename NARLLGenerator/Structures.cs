using System;

namespace NARLLGenerator;

public class Level
{
    public int id { get; set; }
    public string length {get; set;}
    public string featured {get; set;}
    public string name { get; set; }
    public string author { get; set; }
    public string tags {get; set;}
    public string enjoyment { get; set; }
    public string notes {get; set;}
    public List<string> creators { get; set; }
    public string verifier { get; set; }
    public string verification { get; set; }
    public List<Record> records { get; set; }
    public string nong {get; set;}
}

public class Record
{
    public string user { get; set; }
    public string link { get; set; }
    public int percent { get; set; }
    public int hz { get; set; }
}

public class Creator
{
    public string user {get; set;}
    public double points {get; set;}
    public List<string> featured {get; set;}
    public string best {get; set;}
}

public class UnverifiedLevel
{
    public string name {get; set;}
    public int id {get; set;}
    public string author {get; set;}
    public string verifier {get; set;}
    public string progress{get; set;}
}