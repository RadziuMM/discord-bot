import { createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { resetRoom } from '../..';
import { i18n } from '../../../../../i18n';
import logger from '../../../../../util/logger';
import { LogType } from '../../../../../util/logger/enum/log-type.enum';
import { createMessage, deleteMessage } from '../../../../../util/messages';
import { Response } from '../../interface/response.interface';
import { Room } from '../../interface/room.interface';
import play_dl from 'play-dl';


export default async(
  id: string,
  map: Record<string, any>,
): Promise<Response> => {
  const room: Room = map.get(id);
  if (!room || !room.songs?.length)
    return { success: false };
    
  try {
    if (!room.player) room.player = createAudioPlayer();
    const stream = await play_dl.stream(room.songs[0].url)
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    })
    room.player.play(resource);
    room.connection.subscribe(room.player);
    clearTimeout(room.idle);
    room.isPlaying = true;
    
    if(room.trackedSongMessage) deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = await createMessage(
      room.textChannel, 
      `#${room.songs[0]?.title}`, 
      {
        timeout: room.songs[0]?.lengthSeconds * 1000,
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