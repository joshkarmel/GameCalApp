namespace GameCal.Server
{
    public class ReleaseDate
    {
        public int id { get; set; }
        public int date { get; set; }
        
        public DateTime releaseDate => DateTimeOffset.FromUnixTimeSeconds(date).DateTime;
        
        public int game { get; set; }
        public string human { get; set; }
        public int m { get; set; }
        public int y { get; set; }
        public int date_format { get; set; }
        public int platform { get; set; }
    }
}