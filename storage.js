export default class Storage {
    constructor() {
        this.limit = 10;
        this.storedName = "gaSearch.history";
    }

    setLimit(limit) {
        this.limit = limit;
    }

    addEntry(entry) {
       let history = localStorage.getItem(this.storedName)? JSON.parse(localStorage.getItem(this.storedName)) : [];
       if (history.length > this.limit - 1) {
           history.shift();
       }
       history.push(entry);
       localStorage.setItem(this.storedName, JSON.stringify(history));
    }

    getHistory() {
        return localStorage.getItem(this.storedName)? JSON.parse(localStorage.getItem(this.storedName)) : [];
    }
}