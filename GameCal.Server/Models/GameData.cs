namespace GameCal.Server
{
    public class GameData
    {
        public DateTime FirstReleaseDate => DateTimeOffset.FromUnixTimeSeconds(First_Release_Date).DateTime;

        public int Id { get; set; }
        public string? Name { get; set; }
        public long First_Release_Date { get; set; }
        public IEnumerable<long>? Release_Dates { get; set; }
        public int[]? Platforms { get; set; }
        public int? Franchise { get; set; }
        public int? Cover { get; set; }
        public Cover CoverImage { get; set; }
        public int[] Artworks { get; set; } = [];
        public IEnumerable<Artwork> ArtworkImages { get; set; }
        public int RatingCount => aggregated_rating_count;
        public int aggregated_rating_count { get; set; }
    }
}