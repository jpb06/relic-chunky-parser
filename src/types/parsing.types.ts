export class MapData {
    name: string;
    internalName: string;
    url: string;
    players: Array<PlayerData>;
    duration: number;
}

export class PlayerData {
    name: string;
    race: string;
}

export class playerChunk {
    nextPlayerChunkPos: number;
    player: PlayerData;
}

export class ActionChunk {
    pos: number;
    timestamp: number;
}