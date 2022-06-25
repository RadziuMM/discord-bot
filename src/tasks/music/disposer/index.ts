import { Message } from 'discord.js';
import { Song } from './interface/song.interface';
import { Room } from './interface/room.interface';
import _resetRoom from './utils/resetRoom';
import _isSameChannel from './utils/isSameChannel';
import _leaveRoom from './utils/leaveRoom';
import _joinRoom from './utils/joinRoom';
import _play from './utils/play';
import _addToQueue from './utils/addToQueue';
import _getQueue from './utils/getQueue';
import _playNext from './utils/playNext';
import _skip from './utils/skip';
import _stop from './utils/stop';

const map: Map<string, any> = new Map();

const joinRoom = async(message: Message) => await _joinRoom(message, map);
const leaveRoom = async(message: Message) => await _leaveRoom(message, map);
const addToQueue = async(message: Message, songs: Song[]) => await _addToQueue(message, songs, map);
const playNext = async(message: Message, songs: Song[]) => await _playNext(message, songs, map);
const getQueue = async(message: Message) => await _getQueue(message, map);
const play = async(id: string) => await _play(id, map);
const skip = async(message: Message, skipBy: number) => await _skip(message, skipBy, map);
const isSameChannel = async(room: Room, message: Message) => await _isSameChannel(room, message);
const stop = async(message: Message) => await _stop(message, map);
const resetRoom = async(room: Room) => await _resetRoom(room);

export {
  leaveRoom,
  getQueue,
  addToQueue,
  playNext,
  skip,
  stop,
  play,
  isSameChannel,
  resetRoom,
  joinRoom,
};