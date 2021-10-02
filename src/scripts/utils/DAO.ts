import AppModel from "scripts/models/appModel";

export default class DAO{

    static init() {

    }

    static createMapping(tokenId, hash) {
        return new Promise((resolve, reject) => {
            let _db = window._db.getDatabase();
            let transaction = _db.transaction(['nft'], 'readwrite');
            let store = transaction.objectStore('nft');

            let request = store.add({
                tokenId: tokenId,
                hash: hash
            });

            request.onsuccess = resolve;
            request.onerror = reject;
        });
    }

    static getNFTByTokenID(tokenId) {
        return new Promise((resolve, reject) => {
            let _db = window._db.getDatabase();
            let transaction = _db.transaction(['nft'], 'readwrite');
            let store = transaction.objectStore('nft');
            var index = store.index('tokenId');

            let request = index.get(tokenId);

            request.onsuccess = resolve;
            request.onerror = reject;
        });
    }

    static uploadImage(data) {
        const formData  = new FormData();
        formData.append('mint_asset', data.image); // image

        return fetch('/upload', {
            method: 'POST',
            body: formData
        });
    }

    static uploadJSON(data) {
        const formData  = new FormData();
        formData.append('mint_name', data.name);
        formData.append('mint_desc', data.description);
        formData.append('mint_addr', '0x201b134D61510E97bAD396B0B38A2663Bc73B16D'); // transfer to
        formData.append('mint_mid', data.id);
        formData.append('mint_imageurl', data.url);

        return fetch('/upload', {
            method: 'POST',
            body: formData
        });
    }

    static imxMint(tokenId, metadata) {

        const formData  = new FormData();
        formData.append('tokenId', tokenId);
        formData.append('metadata', metadata);
        formData.append('wallet', AppModel.bcModel.wallet);

        return fetch('/mint/imx', {
            method: 'POST',
            body: formData
        })
        .then((res) => res.json());
    }

    static mumbaiMint(cid) {

        const formData  = new FormData();
        formData.append('cid', cid);
        formData.append('wallet', AppModel.bcModel.wallet);

        return fetch('/mint/polygon', {
            method: 'POST',
            body: formData
        })
        .then((res) => res.json());
    }

}


