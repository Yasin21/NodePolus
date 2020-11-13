import PolusBuffer from '../../../util/PolusBuffer'
import Component from '../../PacketElements/Component'
import { Room } from '../../../util/Room'
import { IGameObject, SpawnFlags } from '../../../util/GameObject'
import { GameDataPacketType } from '../GameData'
import { PacketHandler } from '../../Packet'

export enum ObjectType{
	ShipStatus = 0,
	MeetingHud = 1,
	LobbyBehavior = 2,
	GameData = 3,
	Player = 4,
	HeadQuarters = 5,
	PlanetMap = 6,
	AprilShipStatus = 7
}

export const Spawn: PacketHandler<IGameObject> = {
	parse(buffer: PolusBuffer, room: Room): IGameObject {
		const spawnPacket: IGameObject = {
      type: GameDataPacketType.Spawn,
			SpawnID: buffer.readVarInt(),
			ClientID: buffer.readVarInt(),
			Flags: <SpawnFlags>buffer.readU8(),
			Components: []
		}
		let len = buffer.readVarInt();
		for(let i=0;i<len;i++){
			let newComponent = new Component(spawnPacket.SpawnID, i);
			newComponent.old = undefined;
			spawnPacket.Components.push(newComponent.parse(buffer, room));
		}
		return spawnPacket;
  },

	serialize(packet: IGameObject, room: Room): PolusBuffer {
		let PB = new PolusBuffer();
		PB.writeVarInt(packet.SpawnID);
		PB.writeVarInt(packet.ClientID);
		PB.writeU8(packet.Flags);
		PB.writeVarInt(BigInt(packet.Components.length));
		for (let i = 0; i < packet.Components.length; i++) {
			const component = packet.Components[i];
			// console.log(component)
			PB.writeBytes(component.serialize(room))
		}
		return PB;
	}
}
