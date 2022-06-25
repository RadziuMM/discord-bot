import { Message, TextChannel } from 'discord.js';
import play_dl from 'play-dl';
import { createMessage } from '../../../util/messages';
import { i18n } from '../../../i18n';
import { Song } from '../disposer/interface/song.interface';
import { LogType } from '../../../util/logger/enum/log-type.enum';
import logger from '../../../util/logger';

const fetchFromYoutube = async(args: string[]): Promise<any[]> => {
  if (args[0].includes('start_radio')) return [];
  
  const playlist = await play_dl.playlist_info(args[0], { incomplete: true });
  const videos = await playlist.all_videos();
  return videos.map((song: any) => ({
    title: song.title,
    url: song.url,
    lengthSeconds: song.durationInSec,
  }));
}

const fetchFromSpotify = async(args: string[]): Promise<any[]> => {
  try {
    const spotify_data: any = await play_dl.spotify(args[0]);

    if (spotify_data.type === 'track') {
      const phraze = `${spotify_data.name} ${spotify_data.artists[0].name}`
      return fetchByPhrase([phraze]);
    }

    const playlist = await spotify_data.all_tracks();
    const pfrases = playlist.map((track: any) => `${track.name} ${track.artists[0].name}`);

    return Promise.all(
      pfrases.map(async(item: string) => {
        return (await fetchByPhrase([item]))[0];
    }));
  } catch (error: any) {
    logger(`Error while downloading a song from spotify. ${error.message}`, LogType.ERROR);
    return [];
  }
}

const fetchFromLink = async(args: string[]): Promise<any[]> => {
  const songInfo = await play_dl.search(args[0], { limit: 1 });
  return songInfo[0] ? [{
    title: songInfo[0].title,
    url: songInfo[0].url,
    lengthSeconds: songInfo[0].durationInSec,
  }] : [];
}

const fetchByPhrase = async(args: string[]): Promise<any[]> => {
  const phrase = args.join(' ');
  const songInfo = await play_dl.search(phrase, { limit: 1 });
  return songInfo[0] ? [{
    title: songInfo[0].title,
    url: songInfo[0].url,
    lengthSeconds: songInfo[0].durationInSec,
  }] : [];
}

const findSongsByArgs = async(message: Message, args: string[]): Promise<Song[]> => {
  let songs: any = [];
  if (args[0].includes('spotify')) {
    songs = await fetchFromSpotify(args);
  } else if (args[0].includes('youtube') && args[0].includes('list=')) {
    songs = await fetchFromYoutube(args);
    if (!songs.length) {
      logger('Songs not found. User tried to play his own playlist.', LogType.INFO);
      createMessage(
        message.channel as TextChannel,
        i18n('alert_message.private_playlist')
      );
    }
  } else if (args[0].includes('youtube')) {
    songs = await fetchFromLink(args);
    if (!songs.length) {
      logger('Songs not found.', LogType.INFO);
      await createMessage(
        message.channel as TextChannel,
        i18n('message.song_not_found'),
      );
    }
  } else {
    songs = await fetchByPhrase(args);
    if (!songs.length) {
      logger('Songs not found.', LogType.INFO);
      await createMessage(
        message.channel as TextChannel,
        i18n('message.song_not_found'),
      );
    }
  }

  return songs;
};

export { findSongsByArgs }