import { EventEmitter } from "node:events";
class Lock {
    _locked;
    _ee;
    constructor() {
        this._locked = false;
        this._ee = new EventEmitter();
    }
    acquire() {
        return new Promise((resolve) => {
            if (!this._locked) {
                this._locked = true;
                return resolve();
            }
            const tryAcquire = () => {
                if (!this._locked) {
                    this._locked = true;
                    this._ee.removeListener("release", tryAcquire);
                    return resolve();
                }
            };
            this._ee.on("release", tryAcquire);
        });
    }
    release() {
        this._locked = false;
        setImmediate(() => this._ee.emit("release"));
    }
}
export default Lock;
//# sourceMappingURL=lock.js.map