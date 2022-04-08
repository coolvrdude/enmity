const SubMusicRegex: string[] = [
    "open.spotify.com/track/[A-Za-z0-9]+",
    "music.apple.com/[[a-zA-Z][a-zA-Z]]?/album/[a-zA-Z\\d%\\(\\)-]+/[\\d]{1,10}\\?i=[\\d]{1,15}",
    "soundcloud.com/\\S+",
    "listen.tidal.com/track/\\d+",
    "(?:music.|www.)?youtube.com/watch\\S*?v=[0-9a-zA-Z_-]{11}\\S*",
    "www.deezer.com/track/\\d+",
    "music.amazon.com/albums/[0-9A-Z]+\\?trackAsin=[0-9A-Z]+",
    "open.qobuz.com/track/\\d+",
];
export const MusicRegex: RegExp = new RegExp(`(https?://(?:${SubMusicRegex.join("|")}))`, "gi");
