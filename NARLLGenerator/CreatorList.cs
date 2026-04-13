using System;

namespace NARLLGenerator;

public static class CreatorList
{
    public static List<Creator> ProcessCreators(List<Level> levels)
    {
        var creatorsMap = new Dictionary<string, Creator>();

        foreach (var level in levels)
        {
            if (level.creators == null || level.creators.Count == 0)
                continue;

            int basePoints = level.featured == "top" ? 6 : 3;

            double pointsPerCreator = (double)basePoints / level.creators.Count;

            var bestLevel = new Dictionary<string, (string levelId, double points)>();

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

                if (!bestLevel.ContainsKey(c) || pointsPerCreator > bestLevel[c].points)
                {
                    bestLevel[c] = (level.name, pointsPerCreator);
                    creator.best = level.name;
                }
            }
        }

        return creatorsMap.Values.OrderByDescending(c => c.points).ToList();
    }
}
