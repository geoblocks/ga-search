export default class Storage {
    constructor() {
        this.limit = 10;
        this.storedName = "gaSearch.history";
    }

    setLimit(limit) {
        this.limit = limit;
    }

    addEntry(entry) {
        const history = this.getHistory();
        // eliminate duplicated entry
        const duplicatedEntryIdx = history.findIndex(item => item.properties.label === entry.properties.label);
        if (duplicatedEntryIdx > -1) {
            history.splice(duplicatedEntryIdx, 1);
        } else if (history.length > this.limit - 1) {
            history.pop();
        }
        history.unshift(entry);
        localStorage.setItem(this.storedName, JSON.stringify(history));
    }

    getHistory() {
        return localStorage.getItem(this.storedName) ? JSON.parse(localStorage.getItem(this.storedName)) : [];
    }
}
