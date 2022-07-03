import { createAudioPlayer, createAudioResource } from '@discordjs/voice';
import playDl from 'play-dl';
import { i18n } from '../../../../i18n';
import { LogType, logger } from '../../../../util/logger';
import { createMessage, deleteMessage } from '../../../../util/messages';
import { TaskStatus } from '../../interface/task-status.interface';
import { Room } from '../../interface/room.interface';
import { resetRoom } from '..';

export default async (
  id: string,
  map: Record<string, any>,
): Promise<TaskStatus> => {
  const room: Room = map.get(id);
  if (!room || !room.songs?.length) { return { success: false }; }

  try {
    if (!room.player) room.player = createAudioPlayer();
    const stream = await playDl.stream(room.songs[0].url);
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    room.player.play(resource);
    room.connection.subscribe(room.player);
    clearTimeout(room.idle);
    room.isPlaying = true;

    if (room.trackedSongMessage) deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = await createMessage(
      room.textChannel,
      `#${room.songs[0]?.title}`,
      {
        timeout: room.songs[0]?.lengthSeconds ? room.songs[0].lengthSeconds * 1000 : 0,
        countdown: `#${room.songs[0]?.title}`,
      },
    );

    logger(`Playing a song from the queue #${room.songs[0].title}`, LogType.INFO);
    return { success: true };
  } catch (error) {
    resetRoom(room);
    createMessage(
      room.textChannel,
      i18n('alert_message.unknow_error'),
    );

    logger(`A problem was encountered while playing a song #${room.songs[0]?.title}. Error message:${error}`, LogType.ERROR);
    return { success: false };
  }
};
