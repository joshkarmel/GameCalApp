using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace GameCal.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameDataController(ILogger<GameDataController> logger) : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<GameDataController> _logger = logger;
        private const string ClientId = "cjc1widsypa9opyms6m84svcw9kbuz";
        private const string ClientSecret = "ls501ri6v72kuowuy9475nvfe7ekei";

        private const string AccessTokenUrl =
            $"https://id.twitch.tv/oauth2/token?client_id={ClientId}&client_secret={ClientSecret}&grant_type=client_credentials";

        private const string IgdbUrl = "https://api.igdb.com/v4/";

        private string AccessToken;

        [HttpGet(Name = "GetReleaseDates")]
        public async Task<IEnumerable<ReleaseDateList>> Get(string? fields = null)
        {
            try
            {
                AccessToken = await GetTwitchAccessToken();
                if (fields != null)
                {
                    var games = await GetGames(fields);
                    var groupedGames = games.GroupBy(x => x.FirstReleaseDate)
                        .Select(x => new ReleaseDateList
                        {
                            ReleaseDate = x.Key,
                            Games = x
                        });
                    return groupedGames;
                }
                else
                {
                    var dates = await GetReleaseDates(fields);
                    if (dates.Count == 500)
                    {
                        dates.AddRange(await GetReleaseDates(fields+" offset 500;"));
                    }
                    var searchString = dates.Aggregate("where id = (",
                        (current, date) => current + $"{date.game},");
                    searchString = searchString.Remove(searchString.Length - 1) + ");";

                    var games = (await GetGames(searchString)).ToList();

                    var groupedDates = dates
                        .GroupBy(date => date.releaseDate, date => date)
                        .Select(releaseDates => new ReleaseDateList
                        {
                            ReleaseDate = releaseDates.Key,
                            Games = games
                                .Where(g => g.Release_Dates
                                    .Any(releaseId => releaseDates
                                        .Any(releaseDate => releaseDate.id == releaseId)))
                                .ToList()
                        }).ToList();
                    return groupedDates;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                throw new Exception(ex.Message);
            }
        }

        private async Task<List<ReleaseDate>> GetReleaseDates(string? fields)
        {
            var query = fields ?? "fields *; limit 500; where (game.aggregated_rating_count > 0 | game.rating_count > 0) & m = 3 & y = 2025; sort date asc;";
            var response = await SendHttpRequest("release_dates", query);
            var dates = new List<ReleaseDate>();

            var games = new List<GameData>();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                try
                {
                    dates = await response.Content.ReadFromJsonAsync<List<ReleaseDate>>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, ex.Message);
                    _logger.LogError(await response.Content.ReadAsStringAsync());
                }
                // var searchString = dates.Aggregate("where id = (", (current, date) => current + $"{date.game},");
                //
                // searchString = searchString.Remove(searchString.Length - 1) + ");";
                //
                // games = (await GetGames(searchString)).ToList();
            }
            else
            {
                Console.WriteLine(response.StatusCode);
            }

            return dates;
        }

        private async Task<IEnumerable<GameData>> GetGames(string fields)
        {
            var query = $"fields *; limit 500; {fields}";
            var response = await SendHttpRequest("games", query);

            var games = new List<GameData>();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                games = (await response.Content.ReadFromJsonAsync<List<GameData>>()) ?? [];
                Console.WriteLine(await response.Content.ReadAsStringAsync());

                if (games.Any())
                {
                    var searchString = "limit 500; where id = (";
                    foreach (var game in games)
                    {
                        if (game.Cover != 0 && game.Cover != null)
                        {
                            searchString += $"{game.Cover},";
                        }
                    }

                    searchString = searchString.Remove(searchString.Length - 1) + ");";
                    var covers = (await GetCovers(searchString)).ToList();

                    foreach (var game in games)
                    {
                        game.CoverImage = covers.FirstOrDefault(x => x.Id == game.Cover) ?? new Cover();

                        // if (game.Artworks.Length != 0)
                        // {
                        //     searchString = game.Artworks.Aggregate("where id = (", (current, id) => current + $"{id},");
                        //     searchString = searchString.Remove(searchString.Length - 1) + ");";
                        //     game.ArtworkImages = (await GetArtworks(searchString)).ToList();
                        // }
                    }
                }
            }
            else
            {
                Console.WriteLine(response.StatusCode);
            }

            return games;
        }

        private async Task<IEnumerable<Cover>> GetCovers(string searchString)
        {
            var query = $"fields *; {searchString}";
            var response = await SendHttpRequest("covers", query);

            var covers = new List<Cover>();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                covers = (await response.Content.ReadFromJsonAsync<List<Cover>>()) ?? [];
            }
            else
            {
                Console.WriteLine(response.StatusCode);
            }

            return covers;
        }

        private async Task<IEnumerable<Artwork>> GetArtworks(string searchString)
        {
            var query = $"fields *; {searchString}";
            var response = await SendHttpRequest("artworks", query);

            var artworks = new List<Artwork>();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                artworks = (await response.Content.ReadFromJsonAsync<List<Artwork>>()) ?? [];
            }
            else
            {
                Console.WriteLine(response.StatusCode);
            }

            return artworks;
        }


        private async Task<string> GetTwitchAccessToken()
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(AccessTokenUrl);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await client.PostAsync(AccessTokenUrl, new StringContent(""));

            var data = "";

            if (response.StatusCode == HttpStatusCode.OK)
            {
                var accessToken = await response.Content.ReadFromJsonAsync<AccessToken>();
                data = accessToken?.access_token ?? string.Empty;
            }
            else
            {
                Console.WriteLine(response.StatusCode);
            }

            return data;
        }

        private async Task<HttpResponseMessage>? SendHttpRequest(string endpoint, string query = "")
        {
            try
            {
                var client = new HttpClient();
                client.BaseAddress = new Uri(IgdbUrl + endpoint);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var request = new HttpRequestMessage(HttpMethod.Post, client.BaseAddress);
                request.Headers.Add("Authorization", $"Bearer {AccessToken}");
                request.Headers.Add("Client-ID", ClientId);
                request.Content = new StringContent(query);

                var response = await client.SendAsync(request);
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return null;
        }
    }
}