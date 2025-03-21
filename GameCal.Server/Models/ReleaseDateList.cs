namespace GameCal.Server
{
    public class ReleaseDateList
    {
        public int ReleaseDateId { get; set; }
        public DateTimeOffset ReleaseDate { get; set; }
        public IEnumerable<GameData>? Games { get; set; }
    }
}