import { Room, Client } from "colyseus";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {

  maxClients = 5;

  onCreate (options: any) {
    
    this.setState(new MyRoomState());

    this.onMessage("updatePosition", (client: Client, data: any) => {
      
      const player = this.state.players.get(client.sessionId);
      player.x = data["x"];
      player.y = data['y'];
      player.z = data["z"];
    });

  }

  onJoin (client: Client, options: any) {
    
    // Randomize player position on initializing.
    const newPlayer = new Player();
    newPlayer.x = Math.random() * 7.2 - 3.6;
    newPlayer.y = 1.031; // Assuming players are moving on a 2d plane.
    newPlayer.z = Math.random() * 7.2 - 3.6;
    this.state.players.set(client.sessionId, newPlayer);
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
