import {
  AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	DiscordGatewayAdapterCreator,
	joinVoiceChannel,
} from '@discordjs/voice';
import { i18n } from '../i18n';
import play_dl from 'play-dl';
import logger from '../util/logger';
import { LogType } from '../util/logger/enum/log-type.enum';
import { createMessage, deleteMessage } from '../util/messages';
import { Room } from './interface/room.interface';
import { Song } from './interface/song.interface';
import { Message, TextChannel } from 'discord.js';
import { Response } from './interface/response.interface';

const map: Map<string, any> = new Map();

const isSameChannel = (
  room: Room,
  message: Message,
): boolean => {
  if (!room || room.voiceChannel !== message.member!.voice.channel) {
    createMessage(
      message.channel as TextChannel,
      i18n('alert_message.not_in_same_channel'),
    );
    logger(`The user was in a different room from the bot.`, LogType.INFO);
    return false;
  }

  return true;
};

const joinRoom = async(
  message: Message,
): Promise<Response> => {
  if(map.get(message.guild!.id)) {
    await leaveRoom(message);
  }

  const voiceChannel = message.member!.voice.channel;
  const adapter = message.guild!.voiceAdapterCreator !as DiscordGatewayAdapterCreator;

  const room: Room = {
    textChannel: message.channel,
    voiceChannel: voiceChannel,
    connection: joinVoiceChannel({
      channelId: voiceChannel!.id,
      guildId: message.guild!.id,
      adapterCreator: adapter,
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
      await play(message.guild!.id);
    } else {
      room.idle = setTimeout(
        async() => await leaveRoom(message),
        5 * 60 * 1000,
      );
    }
  });

  room.player.on('error', async(error: any) => {
    logger(`A problem was encountered while playing a song. Error: ${error.message}`, LogType.ERROR);
    room.songs.shift();
    await play(message.guild!.id);
  });

  map.set(message.guild!.id, room);
  return { success: true };
}

const leaveRoom = async(
  message: Message,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!room || !isSameChannel(room, message)) {
    return { success: false };
  }

  if (room.trackedSongMessage) {
    deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = null;
  }

  room.textChannel = null;
  await room.connection.destroy();

  map.delete(message.guild!.id);
  logger(`Bot left the room #${message.guild!.id}`, LogType.INFO);
  return { success: true };
}

const play = async(
  id: string,
): Promise<Response> => {
  const room: Room = map.get(id);
  if (!room || !room.songs?.length) return { success: false };
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
      `#${room.songs[0]?.title}`, 
      {
        timeout: room.songs[0]?.lengthSeconds * 1000,
        countdown: `#${room.songs[0]?.title}`,
      },
    );
    return { success: true };
  } catch (error) {
    room.isPlaying = false;
    if(room.trackedSongMessage) deleteMessage(room.trackedSongMessage);
    
    logger(`A problem was encountered while playing a song #${room.songs[0]?.title}. Error message:${error}`, LogType.ERROR);
    createMessage(
      room.textChannel,
      i18n('alert_message.unknow_error'),
    );
    return { success: false };
  }
}

const addToQueue = async(
  message: Message,
  songs: Song[],
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!room?.voiceChannel) {
    await joinRoom(message);
    return addToQueue(message, songs);
  }

  if (!isSameChannel(room, message)) {
    return { success: false };
  }

  songs.forEach(async(song: Song) => room.songs.push(song));
  logger(`Songs added to queue.`, LogType.INFO);

  if (!room.isPlaying) play(message.guild!.id);
  return { success: true };
}

const getQueue = async(
  message: Message,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!room) {
    return { 
      success: false,
      message: i18n('alert_message.room_not_exist')
    };
  }

  if (!isSameChannel(room, message)) return { success: false };
  return {
    success: true,
    data: { songs: room.songs },
  };
};

const playNext = async(
  message: Message,
  songs: Song[],
): Promise<Response|Promise<Response>> => {
  const room: Room = map.get(message.guild!.id);
  if (!isSameChannel(room, message)) {
    return { success: false };
  }

  if (!room || !room?.voiceChannel) {
    await joinRoom(message);
    return addToQueue(message, songs);
  }

  if (!room.songs.length) {
    room.songs = songs;
    return play(message.guild!.id);
  }
  
  const _songs = [...room.songs];
  const cutt = _songs.shift() as Song;
  
  room.songs = [cutt, ...songs, ..._songs];
  if (!room.songs.length) play(message.guild!.id);
  return { success: true };
}

const skip = async(
  message: Message,
  skipBy: number,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!room || !isSameChannel(room, message) || !room?.songs?.length) {
    return { success: false };
  }

  for (let i = 0; i < skipBy; i += 1) room.songs.shift();
  
  if (room.trackedSongMessage) {
    deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = null;
  }

  room.isPlaying = false;
  room.player.stop();
  return { success: true };
}

const stop = async(
  message: Message,
): Promise<Response> => {
  const room: Room = map.get(message.guild!.id);
  if (!isSameChannel(room, message)) {
    return { success: false };
  }

  if (room?.textChannel) {
    room.songs = [];
    room.isPlaying = false;
    room.player.stop();
  }

  if (room.trackedSongMessage) {
    deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = null;
  }

  return { success: true };
}

export {
  leaveRoom,
  getQueue,
  addToQueue,
  playNext,
  skip,
  stop,
};