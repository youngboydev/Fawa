
exports.handler = async function () {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Football API key is not configured."
      })
    };
  }

  try {
    const response = await fetch(
      "https://api.football-data.org/v4/matches",
      {
        headers: {
          "X-Auth-Token": API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: data.message || "Football API request failed."
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30"
      },
      body: JSON.stringify({
        matches: (data.matches || []).map(match => ({
          id: match.id,
          competition: match.competition?.name || "Football",
          homeTeam: match.homeTeam?.name || "Home",
          awayTeam: match.awayTeam?.name || "Away",
          homeCrest: match.homeTeam?.crest || "",
          awayCrest: match.awayTeam?.crest || "",
          utcDate: match.utcDate,
          status: match.status,
          minute: match.minute || null,
          homeScore: match.score?.fullTime?.home ?? null,
          awayScore: match.score?.fullTime?.away ?? null
        }))
      })
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Unable to retrieve football matches."
      })
    };
  }
};
