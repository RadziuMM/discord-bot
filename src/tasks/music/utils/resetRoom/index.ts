import { deleteMessage } from '../../../../util/messages';
import { Room } from '../../interface/room.interface';

export default async (room: Room): Promise<void> => {
  if (room.trackedSongMessage) {
    deleteMessage(room.trackedSongMessage);
    room.trackedSongMessage = null;
  }

  if (room?.textChannel) {
    room.isPlaying = false;
    room.player.stop();
  }
};
