type EventListenerCallback = (...args: any[]) => void;

export default class eventListener {
    private register = {};
    
    on(type: string, method: EventListenerCallback) {
        if (this.register.hasOwnProperty(type)) {
            this.register[type].push(method);
        } else {
            this.register[type] = [method];
        }
    }
    
    fire(type: string, ...args: any[]) {
        if (this.register.hasOwnProperty(type)) {
            const methodList = this.register[type];
            for (const handle of methodList) {
                handle(...args);
            }
        }
    }

    removeListener(type: string) {
        this.register[type] = [];
    }

    removeAllListeners() {
        this.register = {};
    }
}