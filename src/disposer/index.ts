import {
  AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice';
import { i18n } from '../i18n';
import play_dl from 'play-dl';
import logger from '../util/logger';
import { LogType } from '../util/logger/enum/log-type.enum';
import { createMessage, deleteMessage } from '../util/messages';
import { Room } from './interface/room.interface';
import { Song } from './interface/song.interface';
import { Message } from 'discord.js';

const map: Map<string, any> = new Map();

const joinRoom = async(message: any): Promise<void> => {
  if(map.get(message.guild.id)) {
    await leaveRoom(message.guild.id);
  }

  const voiceChannel = message.member.voice.channel;
  const room: Room = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    }),
    player: createAudioPlayer(),
    songs: [],
    isPlaying: false,
    trackedSongMessage: null,
    idle: null,
  };

  room.player.on(AudioPlayerStatus.Idle, async() => {
    room.isPlaying = false;
    room.songs.shift();
    if (room.songs.length) {
      await play(message.guild.id);
    } else {
      room.idle = setTimeout(
        async() => await leaveRoom(message.guild.id),
        5 * 60 * 1000,
      );
    }
  });

  room.player.on('error', async(error: any) => {
    logger(`A problem was encountered while playing a song. Error: ${error.message}`, LogType.ERROR);
    room.songs.shift();
    await play(message.guild.id);
  });

  map.set(message.guild.id, room);
}

const leaveRoom = async(id: any): Promise<void> => {
  const room: Room = map.get(id);
  if (!room) return;

  room.textChannel = null;
  await room.connection.destroy();

  map.delete(id);
  logger(`Bot left the room #${id}`, LogType.INFO);
}

const play = async(id: string): Promise<void> => {
  const room: Room = map.get(id);
  if (!room || !room.songs?.length) return;
  if (!room.player) room.player = createAudioPlayer();

  try {
    const stream = await play_dl.stream(room.songs[0].url)
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
  })

    room.player.play(resource);
    room.connection.subscribe(room.player);
    
    clearTimeout(room.idle);
    room.isPlaying = true;

    logger(`Playing a song from the queue #${room.songs[0].title}`, LogType.INFO);
    if(room.trackedSongMessage) deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = await createMessage(
      room.textChannel, 
      `#${room.songs[0].title}`, 
      {
        timeout: room.songs[0].lengthSeconds * 1000,
        countdown: `#${room.songs[0].title}`,
      },
    );
  } catch (error) {
    room.isPlaying = false;
    if(room.trackedSongMessage) deleteMessage(room.trackedSongMessage);
    
    logger(`A problem was encountered while playing a song #${room.songs[0]?.title}. Error message:${error}`, LogType.ERROR);
    createMessage(room.textChannel, i18n('message.error.fail_play_song', { title: room.songs[0].title }), {});
  }
}

const addToQueue = async(message: any, songs: Song[]): Promise<any> => {
  const room: Room = map.get(message.guild.id);

  if (!room?.voiceChannel) {
    await joinRoom(message);
    return addToQueue(message, songs);
  }

  songs.forEach(async(song: Song) => room.songs.push(song));
  logger(`Songs added to queue.`, LogType.INFO);

  if (!room.isPlaying) play(message.guild.id);
}

const getQueue = async(id: string): Promise<Record<string, any>> => {
  const room: Room = map.get(id);
  if (!room) {
    return {
      success: false,
      data: null,
    };
  } else {
    return {
      success: true,
      data: room.songs,
    };
  }
};

const playNext = async(message: Message, songs: Song[]): Promise<void> => {
  const id = message?.guild?.id || '';
  const room: Room = map.get(id);

  if (!room || !room?.voiceChannel) {
    await joinRoom(message);
    return addToQueue(message, songs);
  }

  if (!room.songs.length) {
    room.songs = songs;
    return play(id);
  }

  const _songs = [...room.songs];
  const cutt = _songs.shift() as Song;

  room.songs = [cutt, ...songs, ..._songs];
  if (room.songs.length) play(id);
}

const skip = async(id: string, skipBy: number): Promise<void> => {
  const room: Room = map.get(id);
  if (!room || !room?.songs?.length) return;

  const skipTo = Math.max(skipBy, 1);
  for (let i = 0; i < skipTo; i+= 1) room.songs.shift();
  
  if (room.trackedSongMessage) {
    deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = null;
  }

  room.player.stop();
  room.isPlaying = false;
  if (room.songs.length) play(id);
}

const stop = async(message: any): Promise<void> => {
  const room: Room = map.get(message.guild.id);
  if (room?.textChannel) {
    room.songs = [];
    room.isPlaying = false;
    room.player.stop();
  }

  if (room.trackedSongMessage) {
    deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = null;
  }
}

export {
  leaveRoom,
  getQueue,
  addToQueue,
  playNext,
  skip,
  stop,
};