import * as fs from 'fs-extra';

import { byteArrayToLong, readUTF16String, uintToString } from './../util/conversion.helper';
import { MapData, playerChunk, ActionChunk } from '../types/parsing.types';

export abstract class RelicChunkyParser {

    public static async getReplayData(
        path: string
    ): Promise<MapData> {

        let data = await fs.readFile(path);

        let pos = 0;
        let length = byteArrayToLong(data.slice(pos, pos + 4)); // length mod name
        let modName = uintToString(data.slice(pos+4, pos + 4 + length)).replace(/\0/g, '');

        pos = 226;
        pos += byteArrayToLong(data.slice(pos, pos + 4)) + 4;
        length = byteArrayToLong(data.slice(pos, pos + 4)); // length map name
        let mapName = readUTF16String(data.slice(pos + 4, pos + 4 + length * 2), true);
        pos += length * 2 + 4;

        length = byteArrayToLong(data.slice(pos, pos + 4)); // map path length
        pos += 4;

        let mapPath = uintToString(data.slice(pos, pos + length));
        pos += length;

        pos += 16;
        //console.log(conversionHelper.uintToString(data.slice(pos, pos+8)));
        pos += 8; // DATABASE
        pos += 32;

        pos += 61; // game options

        length = byteArrayToLong(data.slice(pos, pos + 4)); // length replay name 
        // conversionHelper.readUTF16String(data.slice(pos+4, pos+4+length*2), true);
        pos += length * 2 + 4;

        pos += 4;

        length = byteArrayToLong(data.slice(pos, pos + 4)); // length win conditions
        pos += length + 4;

        let mapData: MapData = {
            name: mapName,
            internalName: mapPath,
            url: '',
            players: [],
            duration: 0,
            modName: modName
        };
        let players = [];
        for (let i = 0; i < 8; i++) {
            let currPos = pos;
            let playerChunkData = RelicChunkyParser.readPlayerChunk(data, pos);
            if (playerChunkData === undefined) {
                pos = currPos;
                break;
            }
            else {
                players.push(playerChunkData.player);
                pos = playerChunkData.nextPlayerChunkPos;
            }
        }

        let lastTimeStamp = 0;
        while (pos < data.length) {
            let type = byteArrayToLong(data.slice(pos, pos + 4));
            pos += 4;
            if (type === 0) {
                let actionData = RelicChunkyParser.readActionChunk(data, pos);
                lastTimeStamp = actionData.timestamp;
                pos = actionData.pos;
            } else if (type === 1) {
                pos = RelicChunkyParser.readChatChunk(data, pos);
            }
        }

        //console.log('pos : '+pos);

        mapData.players = players;
        mapData.duration = lastTimeStamp / 8;

        return mapData;
    }

    private static readPlayerChunk(
        data: Buffer,
        pos: number
    ): playerChunk | undefined {
        // 46 4f 4c 44 47 50 4c 59 = FOLDGPLY
        while (true) {
            if (pos > data.length)
                return undefined;

            if (data[pos] === 70 && data[pos + 1] === 79 && data[pos + 2] === 76 && data[pos + 3] === 68 &&
                data[pos + 4] === 71 && data[pos + 5] === 80 && data[pos + 6] === 76 && data[pos + 7] === 89)
                break;

            pos++;
        }
        pos += 8;

        pos += 4;
        //console.log(data.slice(pos, pos+4));
        let foldgplyLength = byteArrayToLong(data.slice(pos, pos + 4));
        let foldgplyPos = pos + 8;

        pos += 8;
        pos += 8; // DATAINFO
        pos += 12;

        let length = byteArrayToLong(data.slice(pos, pos + 4)); // length player name
        let player = readUTF16String(data.slice(pos + 4, pos + 4 + length * 2), true);

        pos += 4 + 2 * length;

        pos += 4; // player type
        pos += 4; // player team

        length = byteArrayToLong(data.slice(pos, pos + 4)); // length player race

        pos += 4;
        let playerRace = uintToString(data.slice(pos, pos + length));
        pos += length;

        pos += 61;
        pos += 8; // FOLDTCUC

        pos += 12

        pos += 8 // DATALCIN


        // console.log(player);
        // console.log(playerRace);
        // console.log(pos);
        // console.log(foldgplyPos);
        // console.log(foldgplyLength);

        return {
            nextPlayerChunkPos: foldgplyPos + foldgplyLength,
            player: {
                name: player,
                race: playerRace
            }
        };
    }

    private static readActionChunk(
        data: Buffer,
        pos: number
    ): ActionChunk {
        //let type = conversionHelper.byteArrayToLong(data.slice(pos, pos+4));
        // pos += 4;
        let chunkLength = byteArrayToLong(data.slice(pos, pos + 4));
        pos += 4;
        let p = data[pos]; // should be 50 hex / 80 decimal
        if (p !== 80) console.log('error at : ' + pos);
        pos++;
        let timestamp = byteArrayToLong(data.slice(pos, pos + 4));

        // if(chunkLength > 17) {

        // } else {

        // }

        pos += chunkLength - 1;

        return {
            timestamp: timestamp,
            pos: pos
        };
    }

    private static readChatChunk(
        data: Buffer,
        pos: number
    ): number {
        //let type = conversionHelper.byteArrayToLong(data.slice(pos, pos+4));
        // pos += 4;
        let chunkLength = byteArrayToLong(data.slice(pos, pos + 4));
        pos += 4;
        pos += 4; // always 1
        pos += 5;

        let nameLength = byteArrayToLong(data.slice(pos, pos + 4));
        pos += 4;

        //let playerName = '';
        //if(nameLength > 0)  
        //    playerName = conversionHelper.readUTF16String(data.slice(pos, pos+nameLength*2), true);

        pos += nameLength * 2;

        //let playerType = conversionHelper.byteArrayToLong(data.slice(pos, pos+4)); // 0 = obs, 1 = player
        pos += 4;
        pos += 4;

        //let msgDest = conversionHelper.byteArrayToLong(data.slice(pos, pos+4)); // 0 = all, 1 = team
        pos += 4;

        let msgLength = byteArrayToLong(data.slice(pos, pos + 4));
        pos += 4;
        //let msg = conversionHelper.readUTF16String(data.slice(pos, pos+msgLength*2), true);
        pos += msgLength * 2;

        return pos;
    }
}