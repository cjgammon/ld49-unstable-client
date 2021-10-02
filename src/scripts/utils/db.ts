

let storeName = 'be_nft';
let version = 1;

export default class Database{

    initiating: boolean;
    db: any;
    request: any;
    oncomplete: any;

    constructor() {

        if (!window.indexedDB) {
            window.alert('Your browser doesn\'t support a stable version of IndexedDB. Such and such feature will not be available.');
        }

        // attempt to open the database
        this.request = indexedDB.open(storeName, version);
        // upgrade/create the database if needed
        this.request.onupgradeneeded = (e) => this.upgradeneeded(e);
        this.request.onsuccess = (e) => this.success(e);

    }

    getDatabase() {
        return this.db;
    }

    upgradeneeded(e) {
        console.log('upgradeneeded');

        let db,
            nftStore;

        db = e.target.result;
        this.db = db;

        // Version 1 is the first version of the database.
        if (e.oldVersion < 1) {
            this.initiating = true;

            nftStore = db.createObjectStore('nft', {keyPath: 'id', autoIncrement: true});
            nftStore.createIndex('tokenId', 'tokenId', { unique: true });
            nftStore.createIndex('hash', 'hash', { unique: false });
        }

        if (e.oldVersion < 2) {
            // In future versions we'd upgrade our database here.
            // This will never run here, because we're version 1.
        }
    }

    success(e) {
        // assign the database for access outside
        this.db = e.target.result;
        this.db.onerror = this.error;

        if (this.initiating === true) {
            //DAO.addStockLibrary('My Library');
            //DAO.addStockLibrary('Brand Assets');
        }

        console.log('success', this.db);
        this.complete();

    }

    complete() {
        if (this.oncomplete){
            this.oncomplete();
        }
    }

    error() {
        console.log('error', arguments);
    }

}