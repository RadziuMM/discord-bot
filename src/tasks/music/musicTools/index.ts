import { Message, TextChannel } from 'discord.js';
import playDl from 'play-dl';
import { createMessage } from '../../../util/messages';
import { i18n } from '../../../i18n';
import { Song } from '../disposer/interface/song.interface';
import { LogType } from '../../../util/logger/enum/log-type.enum';
import logger from '../../../util/logger';

const fetchByPhrase = async (args: string[]): Promise<any[]> => {
  const phrase = args.join(' ');
  const songInfo = await playDl.search(phrase, { limit: 1 });
  return songInfo[0] ? [{
    title: songInfo[0].title,
    url: songInfo[0].url,
    lengthSeconds: songInfo[0].durationInSec,
  }] : [];
};

const fetchFromSpotify = async (args: string[]): Promise<any[]> => {
  try {
    const spotifyData: any = await playDl.spotify(args[0]);

    if (spotifyData.type === 'track') {
      const phraze = `${spotifyData.name} ${spotifyData.artists[0].name}`;
      return fetchByPhrase([phraze]);
    }

    const playlist = await spotifyData.all_tracks();
    const pfrases = playlist.map((track: any) => `${track.name} ${track.artists[0].name}`);

    return Promise.all(pfrases.map(async (item: string) => await fetchByPhrase([item]))[0]);
  } catch (error: any) {
    logger(`Error while downloading a song from spotify. ${error.message}`, LogType.ERROR);
    return [];
  }
};

const fetchFromYoutubePlaylist = async (args: string[]): Promise<any[]> => {
  const playlist = await playDl.playlist_info(args[0], { incomplete: true });
  const videos = await playlist.all_videos();
  return videos.map((song: any) => ({
    title: song.title,
    url: song.url,
    lengthSeconds: song.durationInSec,
  }));
};

const fetchFromYoutube = async (args: string[]): Promise<any[]> => {
  const songInfo = await playDl.search(args[0], { limit: 1 });
  return songInfo[0] ? [{
    title: songInfo[0].title,
    url: songInfo[0].url,
    lengthSeconds: songInfo[0].durationInSec,
  }] : [];
};

const recognizeDataType = async (args: string[]): Promise<Record<string, any>> => {
  if (args[0].includes('https://') && args[0].includes('spotify')) {
    return {
      type: 'spotify',
      valid: true,
      method: (data: string[]) => fetchFromSpotify(data),
    };
  }

  if (args[0].includes('https://') && args[0].includes('youtube')) {
    const methodA = (data: string[]) => fetchFromYoutubePlaylist(data);
    const methodB = (data: string[]) => fetchFromYoutube(data);
    const message = args[0].includes('start_radio') ? i18n('alert_message.private_playlist') : null;
    return {
      type: 'youtube',
      valid: !args[0].includes('start_radio'),
      method: args[0].includes('list=') ? methodA : methodB,
      message,
    };
  }

  if (args[0].includes('https://')) {
    return {
      type: 'web',
      valid: false,
      method: () => null,
    };
  }

  const markdown = '%';
  if (args[0].includes(markdown)) {
    return {
      type: 'markdown',
      valid: false,
      method: () => null,
    };
  }

  return {
    type: 'phrase',
    valid: true,
    method: (data: string[]) => fetchByPhrase(data),
  };
};

const findSongsByArgs = async (message: Message, args: string[]): Promise<Song[]> => {
  const dataType = await recognizeDataType(args);
  const songs = dataType.valid ? await dataType.method(args) : [];

  if (!songs.length) {
    logger('Songs not found.', LogType.INFO);
    await createMessage(
      message.channel as TextChannel,
      dataType.message || i18n('message.song_not_found'),
    );
  }

  return songs;
};

export default { findByArgs: findSongsByArgs, recognizeDataType };
