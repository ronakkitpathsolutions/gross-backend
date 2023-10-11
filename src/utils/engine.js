import { Server } from "socket.io";

class Engine {
  start = () =>
    new Promise((resolve) => {
      Object.assign(Array.prototype, {
        countWhen(predicate) {
          return this.filter(predicate).length;
        },
      });

      Object.assign(Array.prototype, {
        random() {
          return this[Math.floor(Math.random() * this.length)];
        },
      });

      Object.assign(String.prototype, {
        toBoolean() {
          if (
            this.toLowerCase() === "yes" ||
            this.toLowerCase() === "on" ||
            this === "1" ||
            this === 1
          )
            return true;
          if (
            this.toLowerCase() === "no" ||
            this.toLowerCase() === "off" ||
            this === "0" ||
            this === 0
          )
            return false;
          return null;
        },
      });

      resolve();
    });

  exhaust = (httpServer) => {
    const io = new Server(httpServer, {
      cors: {
        origin: '*'
      }
    });
    return io
  }
}

export default new Engine();
