import { Message, TextChannel } from 'discord.js';
import {
  hasPermissions, isAllowed, Permission, Wheel,
} from '../../../guard';
import { i18n } from '../../../i18n';
import { LogType, logger } from '../../../util/logger';
import { createMessage } from '../../../util/messages';
import { Room } from '../interface/room.interface';
import { Song } from '../interface/song.interface';
import {
  addToQueue,
  findSongsByArguments,
  isSameChannel,
  joinRoom,
  run,
} from '../utils';

export default async (
  message: Message,
  map: Record<string, any>,
): Promise<void> => {
  if (
    !await isAllowed(message, [
      Wheel.WHEEL1,
      Wheel.WHEEL2,
      Wheel.ADMIN,
      Wheel.SUPER,
    ]) || !await hasPermissions(message, [
      Permission.WRITE,
      Permission.CONNECT,
      Permission.SPEAK,
    ])
  ) return;

  const args = message.content.split(' ');
  args.shift();

  try {
    const newSongs = (await findSongsByArguments(message, args)).slice(0, 20);
    if (!newSongs.length) return;
    logger('Songs found.', LogType.INFO);

    const { id } = message.guild!;
    const room: Room = map.get(id);
    if (!room || !room?.voiceChannel) {
      await joinRoom(message, map);
      await addToQueue(message, newSongs, map);
      return;
    }

    if (!isSameChannel(room, message)) return;

    if (!room.songs.length) {
      room.songs = newSongs;
      run(id, map);
      return;
    }

    const songs = [...room.songs];
    const firstSong = songs.shift() as Song;

    room.songs = [firstSong, ...newSongs, ...songs];
    if (!room.songs.length) run(id, map);

    logger('New songs added as next.', LogType.INFO);

    await createMessage(
      message.channel as TextChannel,
      songs.length === 1
        ? i18n('message.added_song', { title: songs[0].title })
        : i18n('message.added_songs'),
    );
  } catch (error: any) {
    logger(`An error occurred while adding a song as next. Error: ${error.message}`, LogType.ERROR);
    await createMessage(
      message.channel as TextChannel,
      i18n('alert_message.unknow_error'),
    );
  }
};
