export default class Storage {
    constructor() {
        this.limit = 10;
        this.storedName = "gaSearch.history";
    }

    setLimit(limit) {
        this.limit = limit;
    }

    addEntry(entry) {
        const history = localStorage.getItem(this.storedName) ? JSON.parse(localStorage.getItem(this.storedName)) : [];
        // eleminate duplicated entry
        const duplicatedEntryIdx = history.findIndex(item => item.properties.label === entry.properties.label);
        if (duplicatedEntryIdx > -1) {
            history.splice(duplicatedEntryIdx, 1);
        } else if (history.length > this.limit - 1) {
            history.shift();
        }
        history.push(entry);
        localStorage.setItem(this.storedName, JSON.stringify(history));
    }

    getHistory() {
        return localStorage.getItem(this.storedName) ? JSON.parse(localStorage.getItem(this.storedName)) : [];
    }
}