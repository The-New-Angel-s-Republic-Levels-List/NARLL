using System;
using System.Collections.Generic;
using System.Linq;

namespace NARLLGenerator;

public static class CreatorList
{
    public static List<Creator> ProcessCreators(List<Level> levels)
    {
        var creatorsMap = new Dictionary<string, Creator>();
        var bestLevel = new Dictionary<string, (string levelName, double points)>();

        foreach (var level in levels)
        {
            if (level.creators == null || level.creators.Count == 0)
                continue;

            int basePoints = 0;

            if (level.featured == "top")
                basePoints = 6;
            else if (level.featured == "feature")
                basePoints = 4;
            else if (level.featured == "highlight")
                basePoints = 2;

            double pointsPerCreator = (double)basePoints / level.creators.Count;

            foreach (var c in level.creators)
            {
                if (!creatorsMap.TryGetValue(c, out var creator))
                {
                    creator = new Creator
                    {
                        user = c,
                        points = 0,
                        featured = new List<string>()
                    };

                    creatorsMap[c] = creator;
                }

                creator.points += pointsPerCreator;

                if (!creator.featured.Contains(level.name))
                    creator.featured.Add(level.name);

                if (!bestLevel.TryGetValue(c, out var currentBest) ||
                    pointsPerCreator > currentBest.points)
                {
                    bestLevel[c] = (level.name, pointsPerCreator);
                    creator.best = level.name;
                }
            }
        }

        return creatorsMap.Values
            .OrderByDescending(c => c.points)
            .ToList();
    }
}