import { Song } from './song.interface';

export interface Room {
  textChannel: any;
  voiceChannel: any;
  connection: any;
  player: any;
  songs: Song[],
  trackedSongMessage: any;
  isPlaying: boolean;
  idle: any;
}